import { Suspense } from "react"; import { AuthCard } from "@/components/auth-card"; import { SiteHeader } from "@/components/site-header";
export default function LoginPage(){return <main className="min-h-screen bg-[#F7F2E7]"><SiteHeader/><section className="container-wide grid min-h-[calc(100vh-76px)] place-items-center py-12"><Suspense><AuthCard mode="login"/></Suspense></section></main>}
