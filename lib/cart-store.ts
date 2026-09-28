export const CART_KEY='qgv-cart-v1';
let memoryQuantity=0;
let storageFailed=false;
export function safeQuantity(value:unknown){const number=Number(value);return Number.isFinite(number)&&number>=0&&Number.isInteger(number)?Math.min(99,number):0;}
export function readCart(){if(!storageFailed)try{memoryQuantity=safeQuantity(localStorage.getItem(CART_KEY));}catch{storageFailed=true;}return memoryQuantity;}
export function writeCart(value:number){memoryQuantity=safeQuantity(value);try{localStorage.setItem(CART_KEY,String(memoryQuantity));storageFailed=false;}catch{storageFailed=true;}window.dispatchEvent(new Event('qgv-cart-changed'));}
