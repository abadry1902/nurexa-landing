import {env} from 'cloudflare:workers';
import {getDb} from '@/db';
import {journeys,events,limits} from '@/db/schema';
import {eq} from 'drizzle-orm';
import {validPhone} from '@/lib/validation';
import {questions,roles,timelines,contactPreferences} from '@/lib/funnel';
const allowed=new Set(['Hero CTA click','Try Agent click','Chat opened','Quick action selected','Signup started','Signup step completed','Signup submitted','Demo requested','Human handoff requested','Landing viewed','Funnel started','Funnel question completed','Funnel edited','Recommendation viewed','Recommendation CTA click','Product selected','Demo request submitted','Handoff submitted','Lead qualified','Video played','Video CTA click']);
const hash=async(t:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)))).map(x=>x.toString(16).padStart(2,'0')).join('');
export async function POST(req:Request){
try{
if(req.headers.get('origin')&&req.headers.get('origin')!==new URL(req.url).origin)return Response.json({error:'طلب غير مسموح'},{status:403});
if(Number(req.headers.get('content-length')||0)>40000)return Response.json({error:'الطلب كبير جدًا'},{status:413});
const raw=await req.text();if(raw.length>40000)return Response.json({error:'الطلب كبير جدًا'},{status:413});
const b=JSON.parse(raw);if(typeof b.id!=='string'||!/^[-a-z0-9]{36}$/i.test(b.id)||typeof b.token!=='string'||b.token.length<32||b.token.length>100)return Response.json({error:'جلسة غير صالحة'},{status:400});
const db=getDb();const now=Date.now();const key=await hash((req.headers.get('cf-connecting-ip')||'local')+':'+Math.floor(now/60000));
// Atomic per-minute quota; no browser-readable lead endpoint.
const quota=await db.insert(limits).values({key,count:1,expires:now+120000}).onConflictDoUpdate({target:limits.key,set:{count:(await import('drizzle-orm')).sql`${limits.count}+1`}}).returning();
if(quota[0].count>90)return Response.json({error:'طلبات كثيرة. حاول بعد دقيقة.'},{status:429});
if(Math.random()<.02)await env.DB!.prepare('DELETE FROM rate_limits WHERE expires < ?').bind(now).run();
const tokenHash=await hash(b.token);const existing=await db.select().from(journeys).where(eq(journeys.id,b.id)).get();if(existing&&existing.tokenHash!==tokenHash)return Response.json({error:'جلسة غير صالحة'},{status:403});
const data:any={};for(const k of ['name','company','phone','email','industry','team','service','channel','goal','volume','role','timeline','contactPreference'])if(typeof b.data?.[k]==='string')data[k]=b.data[k].trim().slice(0,250);
if(Array.isArray(b.data?.tools))data.tools=b.data.tools.filter((v:any)=>typeof v==='string').slice(0,7).map((v:string)=>v.slice(0,50));
for(const q of questions)if(data[q.key]&&!q.options.some(o=>o.value===data[q.key]))return Response.json({error:'إجابة تحديد الاحتياج غير صالحة'},{status:400});
if(data.role&&!roles.includes(data.role)||data.timeline&&!timelines.includes(data.timeline)||data.contactPreference&&!contactPreferences.includes(data.contactPreference))return Response.json({error:'راجع خيارات التأهيل والتواصل'},{status:400});
const complete=b.complete===true;
if(complete&&(!data.role||!data.timeline))return Response.json({error:'حدد دورك في الشركة وموعد البدء المتوقع.'},{status:400});
if(complete&&b.intent==='demo'&&!data.contactPreference)return Response.json({error:'اختر الوقت الأنسب للتواصل بشأن الديمو.'},{status:400});
if(complete&&(!data.name||!data.company||!validPhone(data.phone||'')||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email||'')||!data.industry||!data.team||!['Chat Agent','Voice Agent','Both'].includes(data.service)||!data.tools?.length||b.consent!==true))return Response.json({error:'راجع بيانات التسجيل والموافقة على الخصوصية.'},{status:400});
const source:any={};for(const k of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','landing_timestamp'])source[k]=String(b.source?.[k]||'').slice(0,500);
const stamp=new Date().toISOString();const chat=JSON.stringify(Array.isArray(b.chat)?b.chat.slice(-50).map((m:any)=>({role:m.role==='user'?'user':'assistant',text:String(m.text||'').slice(0,1200)})):[]);
const values={data:JSON.stringify(data),step:Math.max(1,Math.min(5,Number(b.step)||1)),completed:complete||existing?.completed?1:0,chat,intent:['signup','demo','handoff'].includes(b.intent)?b.intent:'signup',updatedAt:stamp};
if(existing)await db.update(journeys).set(existing.completed&&!complete?{chat,updatedAt:stamp}:values).where(eq(journeys.id,b.id));else {await db.insert(journeys).values({id:b.id,tokenHash,...values,source:JSON.stringify(source),createdAt:stamp}).onConflictDoNothing();const inserted=await db.select().from(journeys).where(eq(journeys.id,b.id)).get();if(inserted?.tokenHash!==tokenHash)return Response.json({error:'جلسة غير صالحة'},{status:403});}
if(allowed.has(b.event))await db.insert(events).values({id:crypto.randomUUID(),journeyId:b.id,event:b.event,detail:JSON.stringify({step:b.step,intent:b.intent,action:String(b.action||'').slice(0,200)}),createdAt:stamp});
return Response.json({ok:true,reference:complete?b.id.slice(0,8).toUpperCase():undefined},{headers:{'Cache-Control':'no-store'}});
}catch(e){console.error('Collection failed',e instanceof Error?e.message:'unknown');return Response.json({error:'تعذر الحفظ الآن. حاول مرة أخرى.'},{status:500})}
}
