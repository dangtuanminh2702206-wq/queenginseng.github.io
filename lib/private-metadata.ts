import type { Metadata } from 'next';
export function privateMetadata(title:string):Metadata {
  return {title:`${title} | Queen Ginseng Vietnam`,robots:{index:false,follow:false},alternates:{canonical:null},openGraph:{title:`${title} | Queen Ginseng Vietnam`}};
}
