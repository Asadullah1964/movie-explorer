// app/not-found.tsx (Server Component)
import { Suspense } from 'react';
import NotFoundClient from './not-found.client';


export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-muted">The page you’re looking for doesn’t exist.</p>

      {/* Wrap the client part that reads search params */}
      <Suspense fallback={null}>
        <NotFoundClient />
      </Suspense>
    </div>
  );
}
