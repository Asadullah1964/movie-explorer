'use client';

import ThemeToggle from '@/app/_components/ThemeToggle';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

type NavItem = { label: string; href: string; exact?: boolean };

const NAV: NavItem[] = [
  { label: 'Movies', href: '/' },
  { label: 'TV Shows', href: '/tv' },
  { label: 'Series', href: '/series' },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  const base = href.split('?')[0];
  if (exact) return pathname === base;
  if (base === '/') return pathname === '/';
  return pathname.startsWith(base);
}

function useDebounced(cb: (v: string) => void, delay = 400) {
  const t = useRef<NodeJS.Timeout | null>(null);
  return useCallback((v: string) => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => cb(v), delay);
  }, [cb, delay]);
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  // Hydration guard for search params
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Search
  const q = mounted ? (sp.get('q') ?? '') : '';
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

  // Top-down dropdown
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const t = setTimeout(() => firstLinkRef.current?.focus(), 0);
    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open]);

  // Close on route change
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-token bg-background/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <nav className="flex h-14 items-center gap-3" aria-label="Primary">
          {/* Mobile toggle */}
          <button
            ref={triggerRef}
            type="button"
            aria-label="Toggle menu"
            aria-controls={panelId}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-token bg-surface/80 text-foreground hover:bg-surface md:hidden"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="2" />
            </svg>
          </button>

          {/* Brand */}
          <Link href="/" className="shrink-0 text-sm font-semibold tracking-tight text-foreground">
            Movie Explorer
          </Link>

          {/* Desktop nav */}
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
                        ? 'bg-surface/80 text-foreground'
                        : 'text-foreground/80 hover:bg-surface/70 hover:text-foreground',
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop search */}
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
                className="w-full rounded-lg border border-token bg-surface/90 pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted outline-none ring-0 focus:border-token"
              />
            </label>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>

      {/* Top-down panel: explicit bg ensures link visibility */}
      <div
        id={panelId}
        aria-hidden={!open}
        className={[
          'md:hidden transition-[max-height,opacity] duration-200 ease-out overflow-hidden',
          open ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="w-full border-t border-token bg-background">
          <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
            <nav aria-label="Mobile">
              <ul className="flex flex-col gap-1">
                {NAV.map((item, idx) => {
                  const active = isActive(pathname, item.href, item.exact);
                  return (
                    <li key={item.label}>
                      <Link
                        ref={idx === 0 ? firstLinkRef : undefined}
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={[
                          'block rounded-md px-3 py-2 text-sm transition-colors',
                          // Force clear, visible color on small screens
                          active
                            ? 'bg-surface text-foreground'
                            : 'text-foreground hover:bg-surface/80',
                        ].join(' ')}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Mobile search */}
              <div className="mt-3">
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
                    className="w-full rounded-lg border border-token bg-surface pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted outline-none ring-0 focus:border-token"
                  />
                </label>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
