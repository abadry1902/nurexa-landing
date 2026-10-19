'use client';
import {useId,useEffect,useRef,useState,type CSSProperties} from 'react';
/** Blurred gradient follows the rounded edge; the mask keeps the card face clear. */
export function GlowBorder({radius=22,delay=0,compact=false,welcome=false}:{radius?:number;delay?:number;compact?:boolean;welcome?:boolean}){
 const svg=useRef<SVGSVGElement>(null);
 const rotation=useRef<SVGAnimateTransformElement>(null);
 const [motion,setMotion]=useState(false);
 const [fast,setFast]=useState(welcome);
 useEffect(()=>{
   const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
   const update=()=>setMotion(!preference.matches);
   update();
   preference.addEventListener('change',update);
   return()=>preference.removeEventListener('change',update);
 },[]);
 useEffect(()=>{
   const animation=rotation.current;
   if(!motion||!animation)return;
   const complete=()=>{if(fast)setFast(false)};
   animation.addEventListener('endEvent',complete);
   animation.beginElement();
   return()=>animation.removeEventListener('endEvent',complete);
 },[motion,fast]);
 const [edgeRadius,setEdgeRadius]=useState(compact?Math.min(radius,22):radius);
 useEffect(()=>{
   const surface=svg.current?.parentElement;
   if(!surface)return;
   const update=()=>setEdgeRadius(Math.min(radius,surface.clientHeight/2,surface.clientWidth/2));
   update();
   const observer=new ResizeObserver(update);
   observer.observe(surface);
   return()=>observer.disconnect();
 },[radius]);
 const id=useId().replace(/[^a-zA-Z0-9_-]/g,'');
 const gradient=`halo-gradient-${id}`,blur=`halo-blur-${id}`,mask=`halo-mask-${id}`;
 return <svg ref={svg} className={"card-backglow gradient-backglow "+(compact?"control-glow":"")} aria-hidden="true" focusable="false" style={{'--glow-delay':`${delay}s`} as CSSProperties}>
 <defs><linearGradient id={gradient} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00CB54"/><stop offset="36%" stopColor="#00C994"/><stop offset="65%" stopColor="#08B5D4"/><stop offset="100%" stopColor="#3478F6"/>{motion&&<animateTransform key={fast?'welcome':'ambient'} ref={rotation} attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="360 .5 .5" dur={fast?'1.8s':'18s'} begin="indefinite" repeatCount={fast?'1':'indefinite'} calcMode="linear" fill="freeze"/>}</linearGradient>
 <filter id={blur} filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation={compact?7:12}/></filter>
 <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%"><rect width="100%" height="100%" fill="white"/><rect x="40" y="40" width="calc(100% - 80px)" height="calc(100% - 80px)" rx={edgeRadius} ry={edgeRadius} fill="black"/></mask></defs>
 <g mask={`url(#${mask})`}><rect x="40" y="40" width="calc(100% - 80px)" height="calc(100% - 80px)" rx={edgeRadius} ry={edgeRadius} fill="none" stroke={`url(#${gradient})`} strokeWidth={compact?14:22} filter={`url(#${blur})`}/></g>
 </svg>
}
