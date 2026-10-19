export type Qualification={channel:string;goal:string;volume:string};
export const questions=[
{key:'channel' as const,title:'وين يتواصل معك عملاؤك أكثر؟',hint:'اختر القناة الأساسية اللي تحتاج تغطية أفضل.',options:[{value:'whatsapp',label:'واتساب والموقع',detail:'استفسارات ورسائل طوال اليوم',icon:'chat'},{value:'phone',label:'المكالمات',detail:'استقبال ومتابعة عبر الهاتف',icon:'phone'},{value:'both',label:'الرسائل والمكالمات',detail:'تجربة متصلة بين قنواتك',icon:'both'}]},
{key:'goal' as const,title:'وش النتيجة الأهم لك الآن؟',hint:'نبدأ بالأولوية اللي تفرق مع شغلك.',options:[{value:'respond',label:'الرد على الاستفسارات',detail:'تغطية الأسئلة المتكررة وتأهيل العملاء',icon:'chat'},{value:'booking',label:'تنظيم الحجوزات',detail:'من الاستفسار إلى طلب موعد',icon:'calendar'},{value:'followup',label:'متابعة الفرص',detail:'متابعة العملاء والخطوات القادمة',icon:'both'},{value:'handoff',label:'الاستقبال والتحويل',detail:'توجيه العميل لموظفك مع كامل السياق',icon:'phone'}]},
{key:'volume' as const,title:'تقريبًا، كم تواصل يوصلك يوميًا؟',hint:'تقديرك يكفينا؛ نراجع حجم الاستخدام معك لاحقًا.',options:[{value:'under50',label:'أقل من 50',detail:'رسالة أو مكالمة في اليوم',icon:'volume'},{value:'50to200',label:'من 50 إلى 200',detail:'رسالة أو مكالمة في اليوم',icon:'volume'},{value:'over200',label:'أكثر من 200',detail:'رسالة أو مكالمة في اليوم',icon:'volume'},{value:'unsure',label:'أحتاج أقيّم الحجم',detail:'نحدد الاستخدام المناسب معًا',icon:'volume'}]}
];
export const roles=['صاحب النشاط / مؤسس','مسؤول خدمة العملاء','المبيعات / تطوير الأعمال','التقنية / العمليات','دور آخر'];
export const timelines=['في أقرب وقت','خلال شهر','خلال 3 أشهر','أستكشف الخيارات'];
export const contactPreferences=['صباحًا · 9 ص – 12 م','ظهرًا · 12 م – 4 م','مساءً · 4 م – 7 م','أي وقت عمل مناسب'];
export function qualified(q:Qualification){return questions.every(question=>question.options.some(o=>o.value===q[question.key]));}
export function answerLabel(key:keyof Qualification,value:string){return questions.find(q=>q.key===key)?.options.find(o=>o.value===value)?.label||'لم يُحدد';}
export function recommend(q:Qualification){
 const voice=q.channel==='phone',both=q.channel==='both';
 const service=both?'Both':voice?'Voice Agent':'Chat Agent';
 const receptionist=q.goal==='booking'||q.goal==='handoff';
 const title=receptionist?'موظف استقبال ذكي':both?'وكيلا محادثات ومكالمات':voice?'وكيل مكالمات ذكي':'وكيل محادثات ذكي';
 const tools=both?['WhatsApp','Phone','Website']:voice?['Phone']:['WhatsApp','Website'];
 const reason=q.goal==='booking'?'لأن أولويتك تحويل الاستفسار إلى حجز منظم، مع مراجعة التوافر حسب نظامك.':q.goal==='handoff'?'لأنك تحتاج استقبال العميل وفهم طلبه، ثم توجيهه لموظفك مع كامل التفاصيل.':q.goal==='followup'?'لأنك تحتاج متابعة الفرص وتأهيل العملاء عبر قنوات تواصلهم الحالية.':'لأنك تحتاج إجابات واضحة للأسئلة المتكررة وتأهيل العميل قبل وصوله لفريقك.';
 const flow=q.goal==='booking'?['يستقبل الاستفسار','يجمع تفاصيل الحجز','يراجع الموعد عبر التكامل','يسجل النتيجة في Nurexa OS']:q.goal==='handoff'?['يفهم طلب العميل','يجمع التفاصيل الأساسية','يحوّل لموظف مع السياق','يسجل التحويل في Nurexa OS']:q.goal==='followup'?['يتابع العميل حسب السيناريو','يحدد احتياجه واهتمامه','يجهز الخطوة التالية','يسجل الفرصة في Nurexa OS']:['يستقبل رسالة أو مكالمة','يجيب من معلومات نشاطك','يؤهل الطلب أو يحوّله','يحفظ النتيجة في Nurexa OS'];
 return {service,title,tools,reason,flow,scope:q.volume==='unsure'?'نساعدك أولًا في تقدير حجم الاستخدام.':'نراجع حجم التواصل الذي اخترته لتحديد نطاق التشغيل والباقة.'};
}
