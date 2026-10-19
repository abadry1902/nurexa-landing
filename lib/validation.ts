export function validPhone(value:string){const digits=value.replace(/\D/g,'');return /^\+?[0-9\s()\-]+$/.test(value)&&digits.length>=8&&digits.length<=15&&value.length<=24;}
