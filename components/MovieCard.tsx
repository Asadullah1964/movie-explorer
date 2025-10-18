import Image from 'next/image';
import Link from "next/link";

type Movie = {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  poster_path?: string | null;
  vote_average?: number;
};

export default function MovieCard({ movie }: { movie: Movie }) {
  const title = movie.title || movie.name || 'Untitled';
  const date = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const src = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-poster.svg';

  return (
    <Link href={`/${movie.id}`}>
<article className="group relative overflow-hidden rounded-xl border border-token bg-surface shadow-sm transition hover:shadow-md">
      {/* Media with fixed ratio to avoid layout shift */}
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

        {/* Rating chip (token-based for both themes) */}
        {typeof movie.vote_average === 'number' && (
          <div className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs backdrop-blur
                          bg-[color-mix(in_oklab,var(--foreground)_90%,transparent)]
                          text-[var(--background)]">
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        )}

        {/* Hover overlay (theme-aware scrim) */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200
                        group-hover:pointer-events-auto
                        group-hover:opacity-100
                        group-hover:bg-[color-mix(in_oklab,var(--foreground)_30%,transparent)]">
          <div className="absolute inset-x-2 bottom-2 flex gap-2">
            {/* <button
              className="flex-1 rounded-lg px-3 py-1.5 text-xs font-medium shadow backdrop-blur
                         bg-surface/90 text-foreground hover:bg-surface
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-token"
              aria-label="View details"
            >
              Details
            </button> */}
            <button
              className="rounded-lg px-3 py-1.5 text-xs font-medium backdrop-blur
                         bg-[color-mix(in_oklab,var(--foreground)_85%,transparent)]
                         text-[var(--background)] hover:bg-[color-mix(in_oklab,var(--foreground)_95%,transparent)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-token"
              aria-label="Favorite"
            >
              + Fav
            </button>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-xs text-muted">{date}</p>
      </div>
    </article>

    </Link>
  );
}
