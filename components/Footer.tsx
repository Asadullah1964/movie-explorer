import Link from 'next/link';

const LINKS = [
  { label: 'Movies', href: '/' },
  { label: 'TV Shows', href: '/tv' },
  { label: 'Series', href: '/movies?sort=upcoming' },
  { label: 'Search', href: '/search' },
];

const LEGAL = [
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Cookies', href: '/cookies' },
];

const SOCIAL = [
  { label: 'GitHub', href: 'https://github.com/', icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden fill="currentColor">
        <path d="M12 2C6.48 2 2 6.6 2 12.26c0 4.5 2.87 8.31 6.84 9.66.5.1.68-.22.68-.49l-.01-1.71c-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.13-1.52-1.13-1.52-.93-.65.07-.64.07-.64 1.03.07 1.57 1.08 1.57 1.08.91 1.6 2.39 1.14 2.98.87.09-.68.36-1.14.65-1.4-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05A9.28 9.28 0 0 1 12 7.25c.85 0 1.7.12 2.5.35 1.9-1.32 2.74-1.05 2.74-1.05.56 1.42.21 2.47.11 2.73.64.72 1.03 1.64 1.03 2.76 0 3.94-2.35 4.8-4.58 5.05.37.33.7.98.7 1.98l-.01 2.93c0 .27.18.6.69.49A10.01 10.01 0 0 0 22 12.26C22 6.6 17.52 2 12 2z"/>
      </svg>
    )
  },
  { label: 'Twitter', href: 'https://x.com/', icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden fill="currentColor">
        <path d="M18.244 2h3.308l-7.227 8.26L22 22h-6.773l-5.3-6.928L3.6 22H.29l7.73-8.832L2 2h6.99l4.78 6.315L18.244 2zm-1.186 18h1.833L7.017 3.907H5.05L17.058 20z"/>
      </svg>
    )
  },
  { label: 'YouTube', href: 'https://youtube.com/', icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden fill="currentColor">
        <path d="M23.5 6.2a4 4 0 0 0-2.8-2.8C18.7 3 12 3 12 3s-6.7 0-8.7.4A4 4 0 0 0 .5 6.2 41 41 0 0 0 0 12a41 41 0 0 0 .5 5.8 4 4 0 0 0 2.8 2.8C5.3 21 12 21 12 21s6.7 0 8.7-.4a4 4 0 0 0 2.8-2.8A41 41 0 0 0 24 12a41 41 0 0 0-.5-5.8zM9.6 15.5v-7L16 12l-6.4 3.5z"/>
      </svg>
    )
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-token bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        {/* Top */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand + blurb */}
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Movie Explorer
            </Link>
            <p className="mt-2 max-w-xs text-sm text-muted">
              Discover trending titles, trailers, cast, and where to watch — all in one place.
            </p>
            {/* Social */}
            <div className="mt-4 flex gap-3">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-token bg-surface/70 text-foreground hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-token"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Site links */}
          <div>
            <h3 className="text-sm font-semibold">Browse</h3>
            <ul className="mt-3 space-y-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-token rounded"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-3 space-y-2">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-token rounded"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-[var(--border)]/80" />

        {/* Bottom */}
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Movie Explorer. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            Data provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
}
