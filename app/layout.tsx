import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Nurexa | خدمة عملاء ما توقف',description:'وكلاء ذكاء اصطناعي للمحادثات والمكالمات والحجوزات. اجمع خدمة عملائك في منظومة واحدة مع Nurexa.',robots:{index:true,follow:true},openGraph:{title:'Nurexa | خدمة عملاء ما توقف',description:'وكلاء محادثات ومكالمات. فريقك الذكي على مدار الساعة.',locale:'ar_SA',type:'website'},icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ar" dir="rtl"><body>{children}</body></html>}
