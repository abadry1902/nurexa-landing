'use client';

import {useEffect} from 'react';

// Anchor the enlargement toward the pointer's entry, then keep it stable
// throughout the hover so the element cannot chase its own hit area.
export function PointerMotion(){
  useEffect(()=>{
    const enabled=window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const selector='.product-card,.product-window,.finder-panel,.video-frame,.integration-brand,.finder-options label,.choice-list label,.tool-choices label,button,.btn';
    const enter=(event:PointerEvent)=>{
      if(!enabled.matches||event.pointerType!=='mouse'||!(event.target instanceof Element))return;
      const element=event.target.closest<HTMLElement>(selector);
      if(!element||(event.relatedTarget instanceof Node&&element.contains(event.relatedTarget)))return;
      const rect=element.getBoundingClientRect();
      if(!rect.width||!rect.height)return;
      const clamp=(value:number)=>Math.max(35,Math.min(65,value));
      element.style.setProperty('--pointer-origin',`${clamp((event.clientX-rect.left)/rect.width*100)}% ${clamp((event.clientY-rect.top)/rect.height*100)}%`);
    };
    document.addEventListener('pointerover',enter,{passive:true});
    return()=>document.removeEventListener('pointerover',enter);
  },[]);
  return null;
}
