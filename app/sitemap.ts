import type { MetadataRoute } from "next";
export const dynamic = "force-static";
const root="https://dangtuanminh2702206-wq.github.io/queenginseng.github.io";
export default function sitemap(): MetadataRoute.Sitemap { return ["","/san-pham/bot-tra-sam-nu-hoang-g8","/gio-hang","/dang-nhap","/dang-ky"].map(path=>({url:`${root}${path}`,changeFrequency:path?"monthly":"weekly",priority:path?0.8:1})); }
