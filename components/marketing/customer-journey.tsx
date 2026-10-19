'use client';

import {useEffect,useRef,useState} from 'react';
import {Pause,Play} from 'lucide-react';
import {GlowBorder} from '@/components/ui/glow-border';

export function CustomerJourney(){
  const video=useRef<HTMLVideoElement>(null);
  const [playing,setPlaying]=useState(false);
  useEffect(()=>{
    const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>{
      if(!video.current)return;
      video.current.autoplay=!preference.matches;
      if(preference.matches)video.current.pause();
      else void video.current.play().catch(()=>{});
    };
    update();
    preference.addEventListener('change',update);
    return()=>preference.removeEventListener('change',update);
  },[]);
  return <div className="product-window glow-surface customer-journey">
    <GlowBorder radius={16}/>
    <video ref={video} autoPlay muted loop playsInline preload="metadata"
      onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}
      poster="/media/customer-journey-poster.jpg" width={1920} height={1080}
      aria-label="رحلة عميل داخل Nurexa OS من أول رسالة إلى تأكيد حجز الموعد">
      <source src="/media/customer-journey.mp4" type="video/mp4"/>
      متصفحك لا يدعم عرض الفيديو.
    </video>
    <button className="journey-playback" type="button"
      aria-label={playing?'إيقاف العرض مؤقتًا':'تشغيل العرض'}
      onClick={()=>{if(!video.current)return;if(video.current.paused)void video.current.play().catch(()=>{});else video.current.pause();}}>
      {playing?<Pause size={15}/>:<Play size={15}/>}
    </button>
  </div>;
}
