import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F7F2E7]" aria-label="Đang tải nội dung">
      <div className="h-9 bg-[#052C20]" />
      <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-5 sm:px-8"><Skeleton className="h-9 w-44 bg-[#073D2B]/10" /><Skeleton className="h-9 w-28 bg-[#073D2B]/10" /></div>
      <div className="mx-auto grid min-h-[620px] max-w-[1280px] items-center gap-12 px-5 py-16 lg:grid-cols-2">
        <div className="space-y-5"><Skeleton className="h-4 w-52 bg-[#073D2B]/10" /><Skeleton className="h-20 w-full bg-[#073D2B]/10" /><Skeleton className="h-20 w-4/5 bg-[#073D2B]/10" /><Skeleton className="h-5 w-3/4 bg-[#073D2B]/10" /><Skeleton className="h-12 w-56 rounded-full bg-[#073D2B]/10" /></div>
        <Skeleton className="aspect-[4/3] w-full rounded-[2.5rem] bg-[#073D2B]/10" />
      </div>
    </main>
  );
}

