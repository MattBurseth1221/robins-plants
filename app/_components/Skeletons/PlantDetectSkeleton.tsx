export default function LoadingSkeleton() {
  return (
    <>
      {/* <div className="p-4 shadow-md text-left px-8 mb-4 shadow-slate-400 flex flex-row">
        <SVGSkeleton className="rounded-md inline-block w-[50px] h-[50px]" />
        <div className="grow text-left flex flex-col pl-4">
          <span>
            <Skeleton className="w-[50%]" />
          </span>
          <span>
            <Skeleton className="max-w-full" />
          </span>
          <span>
            <Skeleton className="w-[328px] max-w-full" />
          </span>
          <span>
            <Skeleton className="w-[248px] max-w-full" />
          </span>
        </div>
      </div> */}
      <div className="bg-white text-black p-4 rounded-md shadow-md text-left px-4 mb-4 shadow-slate-400 hover:bg-slate-200 transition duration-150 flex flex-row hover:cursor-pointer animate-pulse">
      <div className="rounded-md h-auto inline-block w-[100px] bg-gray-300" style={{ width: '100px', height: '100px' }}></div>
      <div className="grow text-left flex flex-col pl-4">
        <div className="h-4 bg-gray-300 rounded-sm w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded-sm w-2/3 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded-sm w-full mb-2"></div>
        <div className="h-3 bg-gray-300 rounded-sm w-5/6 mb-2"></div>
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
  <svg className={className + " animate-pulse rounded-sm bg-gray-300"} />
);
