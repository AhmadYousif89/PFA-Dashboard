import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingOverviews() {
  return (
    <div className="flex flex-col gap-8">
      <Skeleton className="h-10 w-40" />
      <div className="flex flex-col justify-between gap-3 *:grow md:flex-row md:gap-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex basis-[58.687%] flex-col gap-4">
          <Skeleton className="h-[218px] w-full" />
          <Skeleton className="h-[519px] w-full" />
        </div>
        <div className="flex basis-[41.312%] flex-col gap-4">
          <Skeleton className="h-[410px] w-full" />
          <Skeleton className="h-[327px] w-full" />
        </div>
      </div>
    </div>
  );
}
