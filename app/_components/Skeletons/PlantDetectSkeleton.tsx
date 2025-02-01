export default function LoadingSkeleton() {
  return (
    <>
      <div className="p-4 shadow-md text-left px-8 mb-4 shadow-slate-400 flex flex-row">
        <SVGSkeleton className="rounded-md inline-block w-[100px] h-[100px]" />
        <div className="flex-grow text-left flex flex-col pl-4">
          <span>
            <Skeleton className="w-[220px] max-w-full" />
          </span>
          <span>
            <Skeleton className="w-[280px] max-w-full" />
          </span>
          <span>
            <Skeleton className="w-[328px] max-w-full" />
          </span>
          <span>
            <Skeleton className="w-[248px] max-w-full" />
          </span>
        </div>
      </div>
    </>
  );
}

const Skeleton = ({ className }: { className: string }) => (
  <div aria-live="polite" aria-busy="true" className={className}>
    <span className="inline-flex w-full animate-pulse select-none rounded-md bg-gray-300 leading-none">
      ‌
    </span>
    <br />
  </div>
);

const SVGSkeleton = ({ className }: { className: string }) => (
  <svg className={className + " animate-pulse rounded bg-gray-300"} />
);
