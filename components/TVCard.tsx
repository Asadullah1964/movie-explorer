import Image from 'next/image';
import Link from 'next/link';

function img(path?: string | null, size = 'w342', fallback = '/placeholder-poster.svg') {
  if (!path) return fallback;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export default function TVCard({ show }: { show: any }) {
  const title = show.name || show.original_name || '—';
  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : '';
  const rating = typeof show.vote_average === 'number' ? show.vote_average.toFixed(1) : null;

  return (
    <Link
      href={`/tv/${show.id}`}
      className="group block overflow-hidden rounded-lg border border-token bg-surface shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-token transition"
    >
      {/* Poster aspect box to prevent CLS (2:3 ratio) */}
      <div className="relative w-full" style={{ aspectRatio: '2 / 3' }}>
        <Image
          src={img(show.poster_path, 'w342')}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {/* Top-right badge for rating if available */}
        {rating ? (
          <span className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur">
            ⭐ {rating}
          </span>
        ) : null}
      </div>

      {/* Meta */}
      <div className="p-2">
        <h3 className="line-clamp-2 text-xs font-medium text-foreground">{title}</h3>
        <p className="mt-1 text-[11px] text-muted">{year || '—'}</p>
      </div>
    </Link>
  );
}
