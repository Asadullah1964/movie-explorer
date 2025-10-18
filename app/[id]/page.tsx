import Image from 'next/image';
import Link from 'next/link';
import TrailerButton from '@/components/TrailerButton';

// Minimal fetch helper
async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: 'no-store', ...init });
  if (!res.ok) throw new Error(`Failed ${res.status}`);
  return res.json();
}

const TMDB = 'https://api.themoviedb.org/3';
const headers = { Authorization: `Bearer ${process.env.TMDB_BEARER}` }; // v4 read token

async function fetchMovieDetailsFull(id: string) {
  const append = [
    'credits',
    'videos',
    'recommendations',
    'images',
    'release_dates',
  ].join(',');
  return fetchJSON<any>(`${TMDB}/movie/${id}?append_to_response=${append}`, { headers });
}

function img(path?: string | null, size = 'w500', fallback = '/placeholder-poster.svg') {
  if (!path) return fallback;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

// Next.js 15: params is async in dynamic routes — must be awaited
export default async function MovieDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const movie = await fetchMovieDetailsFull(id);

  const title = movie.title || movie.original_title || 'Untitled';
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const runtime = typeof movie.runtime === 'number' && movie.runtime > 0 ? `${movie.runtime}m` : '';

  // Content rating
  let rating = '';
  const rds: any[] = movie.release_dates?.results ?? [];
  const byUS = rds.find((r) => r.iso_3166_1 === 'US')?.release_dates ?? [];
  rating = byUS.find((d: any) => d.certification)?.certification || '';
  if (!rating) {
    for (const region of rds) {
      const found = (region.release_dates ?? []).find((d: any) => d.certification);
      if (found?.certification) {
        rating = found.certification;
        break;
      }
    }
  }

  const genres = (movie.genres ?? []).map((g: any) => g.name).join(' • ');
  const companies = (movie.production_companies ?? []).map((c: any) => c.name).join(', ');
  const countries = (movie.production_countries ?? []).map((c: any) => c.iso_3166_1 || c.name).join(', ');
  const spoken = (movie.spoken_languages ?? []).map((l: any) => l.english_name || l.name).join(', ');

  const videos: any[] = movie.videos?.results ?? [];
  const trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ?? videos.find((v) => v.site === 'YouTube');

  const cast: any[] = movie.credits?.cast ?? [];
  const topCast = cast.slice(0, 12);

  const crew: any[] = movie.credits?.crew ?? [];
  const directors = crew.filter((p) => p.job === 'Director').map((p) => p.name).join(', ');
  const writers = crew.filter((p) => ['Screenplay', 'Writer', 'Story'].includes(p.job)).map((p) => p.name).join(', ');

  const recs: any[] = movie.recommendations?.results ?? [];

  return (
    <main className="bg-background text-foreground">
      {/* Backdrop header */}
      <section className="relative">
        <div
          className="absolute inset-0 -z-10 bg-center bg-cover"
          style={{
            backgroundImage: movie.backdrop_path
              ? `url('https://image.tmdb.org/t/p/w1280${movie.backdrop_path}')`
              : 'none',
          }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--foreground)_0%,transparent),color-mix(in_oklab,var(--foreground)_28%,transparent),color-mix(in_oklab,var(--foreground)_55%,transparent))]" />

        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            {/* Poster */}
            <div className="w-full max-w-[340px] overflow-hidden rounded-xl border border-token bg-surface shadow">
              <Image
                src={img(movie.poster_path, 'w500')}
                alt={title}
                width={350}
                height={520}
                className="h-auto w-full object-cover"
                priority
              />
            </div>

            {/* Primary info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold md:text-4xl">
                {title} {year ? `(${year})` : ''}
              </h1>
              <p className="mt-2 text-sm text-muted">
                {genres || '—'} {rating ? ` • ${rating}` : ''} {runtime ? ` • ${runtime}` : ''}
              </p>

              {/* Quick facts */}
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                {movie.status ? (
                  <span className="rounded-full border border-token bg-surface/70 px-3 py-1">
                    Status: {movie.status}
                  </span>
                ) : null}
                {movie.release_date ? (
                  <span className="rounded-full border border-token bg-surface/70 px-3 py-1">
                    Release: {movie.release_date}
                  </span>
                ) : null}
                {typeof movie.vote_average === 'number' ? (
                  <span className="rounded-full border border-token bg-surface/70 px-3 py-1">
                    ⭐ {movie.vote_average.toFixed(1)}
                  </span>
                ) : null}
                {movie.vote_count ? (
                  <span className="rounded-full border border-token bg-surface/70 px-3 py-1">
                    {movie.vote_count.toLocaleString()} votes
                  </span>
                ) : null}
                {directors ? (
                  <span className="rounded-full border border-token bg-surface/70 px-3 py-1">
                    Director: {directors}
                  </span>
                ) : null}
                {writers ? (
                  <span className="rounded-full border border-token bg-surface/70 px-3 py-1">
                    Writer: {writers}
                  </span>
                ) : null}
              </div>

              {/* Overview */}
              {movie.overview ? (
                <p className="mt-5 max-w-3xl text-sm leading-6 text-foreground">
                  {movie.overview}
                </p>
              ) : null}

              {/* Secondary facts */}
              <div className="mt-6 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                {companies ? <p className="text-muted"><span className="text-foreground">Companies:</span> {companies}</p> : null}
                {countries ? <p className="text-muted"><span className="text-foreground">Countries:</span> {countries}</p> : null}
                {spoken ? <p className="text-muted"><span className="text-foreground">Languages:</span> {spoken}</p> : null}
                {typeof movie.budget === 'number' && movie.budget > 0 ? (
                  <p className="text-muted"><span className="text-foreground">Budget:</span> ${movie.budget.toLocaleString()}</p>
                ) : null}
                {typeof movie.revenue === 'number' && movie.revenue > 0 ? (
                  <p className="text-muted"><span className="text-foreground">Revenue:</span> ${movie.revenue.toLocaleString()}</p>
                ) : null}
              </div>

              {/* Trailer button with modal */}
              {trailer ? (
                <div className="mt-6">
                  <TrailerButton videoKey={trailer.key} />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Fade into page background */}
        <div className="pointer-events-none h-16 w-full bg-[linear-gradient(to_bottom,transparent,var(--background))]" />
      </section>

      {/* Cast */}
      {topCast.length ? (
        <section className="mx-auto mt-4 max-w-7xl px-4 md:px-6">
          <h2 className="text-xl font-semibold">Top Cast</h2>
          <div
            className="mt-3 flex gap-4 overflow-x-auto pb-2
            [--edge:var(--background)] [--mask:linear-gradient(90deg,transparent,var(--edge)_8%,var(--edge)_92%,transparent)] [mask-image:var(--mask)]
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {topCast.map((p) => (
              <div key={p.cast_id ?? `${p.id}-${p.credit_id}`} className="min-w-[140px] max-w-[140px]">
                <div className="overflow-hidden rounded-lg border border-token bg-surface shadow">
                  <Image
                    src={img(p.profile_path, 'w185', '/avatar-placeholder.png')}
                    alt={p.name}
                    width={140}
                    height={180}
                    className="h-[180px] w-full object-cover"
                  />
                </div>
                <p className="mt-2 text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted">{p.character || '—'}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Videos grid (kept as external links) */}
      {videos.filter((v) => v.site === 'YouTube').length ? (
        <section className="mx-auto mt-8 max-w-7xl px-4 md:px-6">
          <h2 className="text-xl font-semibold">Videos</h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos
              .filter((v) => v.site === 'YouTube')
              .slice(0, 6)
              .map((v) => (
                <a
                  key={v.id}
                  href={`https://www.youtube.com/watch?v=${v.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative overflow-hidden rounded-xl border border-token bg-surface shadow hover:shadow-md"
                >
                  <Image
                    src={`https://i.ytimg.com/vi/${v.key}/hqdefault.jpg`}
                    alt={v.name}
                    width={480}
                    height={270}
                    className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-medium">{v.name}</p>
                    <p className="text-xs text-muted">{v.type}</p>
                  </div>
                </a>
              ))}
          </div>
        </section>
      ) : null}

      {/* Recommendations */}
      {recs.length ? (
        <section className="mx-auto mt-8 max-w-7xl px-4 pb-10 md:px-6">
          <h2 className="text-xl font-semibold">Recommended</h2>
          <div
            className="mt-3 flex gap-4 overflow-x-auto pb-2
            [--edge:var(--background)] [--mask:linear-gradient(90deg,transparent,var(--edge)_8%,var(--edge)_92%,transparent)] [mask-image:var(--mask)]
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {recs.slice(0, 12).map((r) => (
              <Link
                key={r.id}
                href={`/movies/${r.id}`}
                className="min-w-[160px] max-w-[160px] overflow-hidden rounded-lg border border-token bg-surface shadow hover:shadow-md"
              >
                <Image
                  src={img(r.poster_path, 'w342')}
                  alt={r.title || r.original_title || '—'}
                  width={180}
                  height={260}
                  className="h-[240px] w-full object-cover"
                />
                <div className="p-2">
                  <p className="line-clamp-2 text-xs font-medium">
                    {r.title || r.original_title || '—'}
                  </p>
                  {typeof r.vote_average === 'number' ? (
                    <p className="mt-1 text-[11px] text-muted">⭐ {r.vote_average.toFixed(1)}</p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main> 
  );
}
