'use client';

import { signOut, useSession } from "next-auth/react";
import ThemeToggle from '@/app/_components/ThemeToggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import SearchBar from './SearchBar';

type NavItem = { label: string; href: string; exact?: boolean };

const NAV: NavItem[] = [
  { label: 'Movies', href: '/', exact: true },
  { label: 'TV Shows', href: '/tv' },
  { label: 'Series', href: '/series' },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  const base = href.split('?')[0];

  if (exact) return pathname === base;
  if (base === '/') return pathname === '/';

  return pathname === base || pathname.startsWith(`${base}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <nav className="flex h-16 items-center gap-3" aria-label="Primary">
          {/* Mobile toggle */}
          <button
            ref={triggerRef}
            type="button"
            aria-label="Toggle menu"
            aria-controls={panelId}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="2" />
            </svg>
          </button>

          {/* Brand */}
          <Link
            href="/"
            className="shrink-0 text-base font-bold tracking-tight text-foreground"
          >
            VistaFlix
          </Link>

          {/* Desktop nav */}
          <ul className="ml-4 hidden items-center gap-2 md:flex">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href, item.exact);

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={[
                      'inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
                      active
                        ? 'bg-gray-200 text-gray-900 shadow-sm ring-1 ring-gray-300 dark:bg-gray-700 dark:text-white dark:ring-gray-600'
                        : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-800',
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex-1" />

          {/* Desktop search */}
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile dropdown */}
      <div
        id={panelId}
        aria-hidden={!open}
        className={[
          'overflow-hidden transition-[max-height,opacity] duration-200 ease-out md:hidden',
          open ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="w-full border-t border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
            <nav aria-label="Mobile">
              <ul className="flex flex-col gap-2">
                {NAV.map((item, idx) => {
                  const active = isActive(pathname, item.href, item.exact);

                  return (
                    <li key={item.label}>
                      <Link
                        ref={idx === 0 ? firstLinkRef : undefined}
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={[
                          'block rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                          active
                            ? 'bg-gray-200 text-gray-900 shadow-sm ring-1 ring-gray-300 dark:bg-gray-700 dark:text-white dark:ring-gray-600'
                            : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-800',
                        ].join(' ')}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4">
                <SearchBar size="sm" placeholder="Search movies..." />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}