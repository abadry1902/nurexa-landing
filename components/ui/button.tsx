'use client';
import * as React from 'react';
import {GlowBorder} from './glow-border';
import {Slot} from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const buttonVariants=cva('btn',{variants:{variant:{default:'btn-primary',outline:'btn-outline',ghost:'btn-ghost',secondary:'btn-outline',destructive:'btn-destructive',link:'btn-ghost'},size:{default:'',sm:'btn-sm',lg:'btn-lg',icon:'btn-icon','icon-sm':'btn-icon','icon-lg':'btn-icon',xs:'btn-sm','icon-xs':'btn-icon'}},defaultVariants:{variant:'default',size:'default'}});
export function Button({className,variant,size,asChild=false,children,...props}:React.ComponentProps<'button'>&VariantProps<typeof buttonVariants>&{asChild?:boolean}){const Comp=asChild?Slot.Root:'button';return <Comp data-slot="button" className={twMerge(clsx(buttonVariants({variant,size}),className))} {...props}>{asChild?children:<>{children}{(!variant||variant==='default')&&!props.disabled&&<GlowBorder radius={99} compact/>}</>}</Comp>}
