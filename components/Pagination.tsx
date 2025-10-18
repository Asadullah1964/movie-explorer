'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const page = Number(sp.get('page') ?? 1);

  const hrefWith = (name: string, value: string | number) => {
    const params = new URLSearchParams(sp.toString());
    params.set(name, String(value));
    return `${pathname}?${params.toString()}`;
  };

  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);

  return (
    <div className="flex items-center justify-center gap-2">
      <Link
        href={hrefWith('page', prev)}
        aria-disabled={page === 1}
        className="rounded-md border border-zinc-300/70 px-3 py-1.5 text-sm text-zinc-800 hover:bg-zinc-100 aria-disabled:opacity-50 dark:border-white/15 dark:text-zinc-200 dark:hover:bg-white/10"
      >
        Previous
      </Link>
      <span className="text-sm text-zinc-600 dark:text-zinc-300">
        Page {page} of {totalPages}
      </span>
      <Link
        href={hrefWith('page', next)}
        aria-disabled={page === totalPages}
        className="rounded-md border border-zinc-300/70 px-3 py-1.5 text-sm text-zinc-800 hover:bg-zinc-100 aria-disabled:opacity-50 dark:border-white/15 dark:text-zinc-200 dark:hover:bg-white/10"
      >
        Next
      </Link>
    </div>
  );
}
