import Image from 'next/image';
import Link from 'next/link';

type Series = {
  id: number;
  name?: string;
  poster_path?: string | null;
  first_air_date?: string;
  vote_average?: number;
};

export default function SeriesCard({ series }: { series: Series }) {
  const title = series.name || 'Untitled';
  const year = series.first_air_date ? new Date(series.first_air_date).getFullYear() : '';
  const src = series.poster_path
    ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
    : '/placeholder-poster.svg';

  return (
    <Link
      href={`/series/${series.id}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-token rounded-xl"
    >
      <article className="relative overflow-hidden rounded-xl border border-token bg-surface shadow-sm transition hover:shadow-md">
        {/* Poster with stable 2:3 ratio */}
        <div className="relative">
          <div className="aspect-[2/3]">
            <Image
              src={src}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              placeholder="empty"
            />
          </div>

          {/* Rating chip (optional) */}
          {typeof series.vote_average === 'number' && (
            <div className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs backdrop-blur
                            bg-[color-mix(in_oklab,var(--foreground)_90%,transparent)]
                            text-[var(--background)]">
              ⭐ {series.vote_average.toFixed(1)}
            </div>
          )}

          {/* Hover scrim hint */}
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200
                          group-hover:opacity-100
                          group-hover:bg-[color-mix(in_oklab,var(--foreground)_20%,transparent)]" />
        </div>

        {/* Meta */}
        <div className="p-3 text-center">
          <h2 className="line-clamp-2 text-sm font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-xs text-muted">{year}</p>
        </div>
      </article>
    </Link>
  );
}
