'use client';

import ThemeToggle from '@/app/_components/ThemeToggle';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

type NavItem = { label: string; href: string; exact?: boolean };

const NAV: NavItem[] = [
  { label: 'Movies', href: '/' },
  { label: 'TV Shows', href: '/tv' },
  { label: 'Series', href: '/series' },
];

function useDebounced(cb: (v: string) => void, delay = 400) {
  const t = useRef<NodeJS.Timeout | null>(null);
  return useCallback((v: string) => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => cb(v), delay);
  }, [cb, delay]);
}

function isActive(pathname: string, href: string, exact?: boolean) {
  const base = href.split('?')[0];
  if (exact) return pathname === base;
  if (base === '/') return pathname === '/';
  return pathname.startsWith(base);
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  // Mount guard to keep SSR and first client render identical
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const q = mounted ? (sp.get('q') ?? '') : ''; // avoid SSR/client mismatch
  const [query, setQuery] = useState('');
  useEffect(() => setQuery(q), [q]);

  const makeQS = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(mounted ? sp.toString() : '');
    if (value) params.set(name, value);
    else params.delete(name);
    return params.toString();
  }, [sp, mounted]);

  const pushSearch = useDebounced((value: string) => {
    if (!mounted) return;
    router.push(`/search?${makeQS('q', value)}`);
  }, 450);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/85 backdrop-blur border-b border-token">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <nav className="flex h-14 items-center gap-3" aria-label="Primary">
          <Link href="/" className="shrink-0 text-sm font-semibold tracking-tight text-foreground">
            Movie Explorer
          </Link>

          <ul className="ml-2 hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href, item.exact);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={[
                      'rounded-md px-3 py-2 text-sm transition-colors',
                      active
                        ? 'bg-surface/70 text-foreground'
                        : 'text-muted hover:bg-surface/60 hover:text-foreground',
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex-1" />

          <div className="hidden w-full max-w-md md:block">
            <label className="relative block">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="7" strokeWidth="2" />
                  <path d="M20 20l-3.5-3.5" strokeWidth="2" />
                </svg>
              </span>
              <input
                value={query}
                onChange={(e) => {
                  const v = e.target.value;
                  setQuery(v);
                  pushSearch(v);
                }}
                placeholder="Search movies..."
                className="w-full rounded-lg border border-token bg-surface/80 pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted outline-none ring-0 focus:border-token"
              />
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              prefetch={false}
              className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-token bg-surface/70 text-foreground hover:bg-surface md:hidden"
              aria-label="Open search"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="7" strokeWidth="2" />
                <path d="M20 20l-3.5-3.5" strokeWidth="2" />
              </svg>
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </div>
      <div className="h-px w-full bg-[var(--border)]/80" />
    </header>
  );
}
