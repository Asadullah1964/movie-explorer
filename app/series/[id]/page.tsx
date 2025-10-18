import Image from 'next/image';
import Link from 'next/link';
import TrailerButton from '@/components/TrailerButton';

// You can keep these in lib/api; shown inline for clarity.
async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: 'no-store', ...init });
  if (!res.ok) throw new Error(`Failed ${res.status}`);
  return res.json();
}

const TMDB = 'https://api.themoviedb.org/3';
const headers = { Authorization: `Bearer ${process.env.TMDB_BEARER}` };

async function fetchSeriesDetailsFull(id: string) {
  const append = [
    'credits',       // cast and crew
    'videos',        // trailers/teasers
    'recommendations',
    'images',        // backdrops & posters (optional use)
    'content_ratings',
  ].join(',');
  return fetchJSON<any>(`${TMDB}/tv/${id}?append_to_response=${append}`, { headers });
}

function img(path?: string | null, size = 'w500', fallback = '/placeholder-poster.svg') {
  if (!path) return fallback;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export default async function SeriesDetails({ params }: { params: { id: string } }) {
  const series = await fetchSeriesDetailsFull(params.id);

  const title = series.name || series.original_name || 'Untitled';
  const year = series.first_air_date ? new Date(series.first_air_date).getFullYear() : '';
  const runtime = Array.isArray(series.episode_run_time) && series.episode_run_time.length
    ? `${series.episode_run_time[0]}m`
    : '';
  const rating = Array.isArray(series.content_ratings?.results)
    ? series.content_ratings.results.find((r: any) => r.iso_3166_1 === 'US')?.rating ?? ''
    : '';
  const genres = (series.genres ?? []).map((g: any) => g.name).join(' • ');
  const creators = (series.created_by ?? []).map((p: any) => p.name).join(', ');
  const networks = (series.networks ?? []).map((n: any) => n.name).join(', ');

  // Videos: prefer official Trailer on YouTube
  const videos: any[] = series.videos?.results ?? [];
  const trailer = videos.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  ) ?? videos.find((v) => v.site === 'YouTube');

  const cast: any[] = series.credits?.cast ?? [];
  const topCast = cast.slice(0, 12);

  const seasons: any[] = series.seasons ?? [];
  const recs: any[] = series.recommendations?.results ?? [];

  return (
    <main className="bg-background text-foreground">
      {/* Backdrop header */}
      <section className="relative">
        <div
          className="absolute inset-0 -z-10 bg-center bg-cover"
          style={{
            backgroundImage: series.backdrop_path
              ? `url('https://image.tmdb.org/t/p/w1280${series.backdrop_path}')`
              : 'none',
          }}
          aria-hidden
        />
        {/* Token-aware scrim for readability */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--foreground)_0%,transparent),color-mix(in_oklab,var(--foreground)_28%,transparent),color-mix(in_oklab,var(--foreground)_55%,transparent))]" />

        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            {/* Poster */}
            <div className="w-full max-w-[340px] overflow-hidden rounded-xl border border-token bg-surface shadow">
              <Image
                src={img(series.poster_path, 'w500')}
                alt={title}
                width={350}
                height={520}
                className="h-auto w-full object-cover"
                priority
              />
            </div>

            {/* Primary info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold md:text-4xl">{title} {year ? `(${year})` : ''}</h1>
              <p className="mt-2 text-sm text-muted">
                {genres || '—'} {rating ? ` • ${rating}` : ''} {runtime ? ` • ${runtime}` : ''}
              </p>

              {/* Quick facts */}
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                {series.number_of_seasons ? (
                  <span className="rounded-full border border-token bg-surface/70 px-3 py-1">
                    Seasons: {series.number_of_seasons}
                  </span>
                ) : null}
                {series.number_of_episodes ? (
                  <span className="rounded-full border border-token bg-surface/70 px-3 py-1">
                    Episodes: {series.number_of_episodes}
                  </span>
                ) : null}
                {series.status ? (
                  <span className="rounded-full border border-token bg-surface/70 px-3 py-1">
                    Status: {series.status}
                  </span>
                ) : null}
                {networks ? (
                  <span className="rounded-full border border-token bg-surface/70 px-3 py-1">
                    Network: {networks}
                  </span>
                ) : null}
                {creators ? (
                  <span className="rounded-full border border-token bg-surface/70 px-3 py-1">
                    Creator: {creators}
                  </span>
                ) : null}
                {typeof series.vote_average === 'number' ? (
                  <span className="rounded-full border border-token bg-surface/70 px-3 py-1">
                    ⭐ {series.vote_average.toFixed(1)}
                  </span>
                ) : null}
              </div>

              {/* Overview */}
              {series.overview ? (
                <p className="mt-5 max-w-3xl text-sm leading-6 text-foreground">
                  {series.overview}
                </p>
              ) : null}

              {/* Trailer button */}
              {trailer ? (
  <div className="mt-6">
    {/* Use local modal instead of external YouTube navigation */}
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

      {/* Seasons */}
      {seasons.length ? (
        <section className="mx-auto mt-8 max-w-7xl px-4 md:px-6">
          <h2 className="text-xl font-semibold">Seasons</h2>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {seasons.map((s) => (
              <div key={s.id} className="overflow-hidden rounded-lg border border-token bg-surface shadow">
                <Image
                  src={img(s.poster_path, 'w342')}
                  alt={s.name}
                  width={240}
                  height={360}
                  className="h-[280px] w-full object-cover"
                />
                <div className="p-3">
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="text-xs text-muted">
                    {s.episode_count ? `${s.episode_count} eps` : ''}{s.air_date ? ` • ${s.air_date}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Trailers (YouTube) */}
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
                href={`/series/${r.id}`}
                className="min-w-[160px] max-w-[160px] overflow-hidden rounded-lg border border-token bg-surface shadow hover:shadow-md"
              >
                <Image
                  src={img(r.poster_path, 'w342')}
                  alt={r.name || r.original_name || '—'}
                  width={180}
                  height={260}
                  className="h-[240px] w-full object-cover"
                />
                <div className="p-2">
                  <p className="line-clamp-2 text-xs font-medium">
                    {r.name || r.original_name || '—'}
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
