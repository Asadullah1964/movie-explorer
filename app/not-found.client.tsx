// app/not-found.client.tsx (Client Component)
'use client';

import { useSearchParams } from 'next/navigation';

export default function NotFoundClient() {
  const sp = useSearchParams(); // OK inside Suspense
  const q = sp.get('q') ?? '';
  return q ? <p className="mt-4 text-sm">Tried searching for: “{q}”.</p> : null;
}
