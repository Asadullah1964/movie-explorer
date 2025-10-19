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
const headers = { Authorization: `Bearer ${process.env.TMDB_BEARER}` }; // v4 token

async function fetchTvDetailsFull(id: string) {
  const append = [
    'credits',           // cast + crew
    'videos',            // trailers/teasers
    'recommendations',   // similar shows
    'images',            // posters/backdrops
    'content_ratings',   // TV content ratings per country
  ].join(',');
  return fetchJSON<any>(`${TMDB}/tv/${id}?append_to_response=${append}`, { headers });
}

function img(path?: string | null, size = 'w500', fallback = '/placeholder-poster.svg') {
  if (!path) return fallback;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

// Next.js 15: params is async
export default async function TvDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tv = await fetchTvDetailsFull(id);

  const title = tv.name || tv.original_name || 'Untitled';
  const year = tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : '';
  const episodeRuntime = Array.isArray(tv.episode_run_time) && tv.episode_run_time.length
    ? `${tv.episode_run_time[0]}m`
    : '';

  // Content rating (US preferred)
  let rating = '';
  const cr: any[] = tv.content_ratings?.results ?? [];
  const us = cr.find((r) => r.iso_3166_1 === 'US');
  rating = us?.rating || '';
  if (!rating) rating = cr.find((r) => r.rating)?.rating || '';

  const genres = (tv.genres ?? []).map((g: any) => g.name).join(' • ');
  const creators = (tv.created_by ?? []).map((p: any) => p.name).join(', ');
  const networks = (tv.networks ?? []).map((n: any) => n.name).join(', ');

  const videos: any[] = tv.videos?.results ?? [];
  const trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ?? videos.find((v) => v.site === 'YouTube');

  const cast: any[] = tv.credits?.cast ?? [];
  const topCast = cast.slice(0, 12);

  const seasons: any[] = tv.seasons ?? [];
  const recs: any[] = tv.recommendations?.results ?? [];

  return (
    <main className="bg-background text-foreground">
      {/* Backdrop header */}
      <section className="relative">
        <div
          className="absolute inset-0 -z-10 bg-center bg-cover"
          style={{
            backgroundImage: tv.backdrop_path
              ? `url('https://image.tmdb.org/t/p/w1280${tv.backdrop_path}')`
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
                src={img(tv.poster_path, 'w500')}
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
                {genres || '—'} {rating ? ` • ${rating}` : ''} {episodeRuntime ? ` • ${episodeRuntime}` : ''}
              </p>

              {/* Quick facts */}
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                {tv.number_of_seasons ? (
                  <span className="rounded-full border border-token bg-surface/70 px-3 py-1">
                    Seasons: {tv.number_of_seasons}
                  </span>
                ) : null}
                {tv.number_of_episodes ? (
                  <span className="rounded-full border border-token bg-surface/70 px-3 py-1">
                    Episodes: {tv.number_of_episodes}
                  </span>
                ) : null}
                {tv.status ? (
                  <span className="rounded-full border border-token bg-surface/70 px-3 py-1">
                    Status: {tv.status}
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
                {typeof tv.vote_average === 'number' ? (
                  <span className="rounded-full border border-token bg-surface/70 px-3 py-1">
                    ⭐ {tv.vote_average.toFixed(1)}
                  </span>
                ) : null}
              </div>

              {/* Overview */}
              {tv.overview ? (
                <p className="mt-5 max-w-3xl text-sm leading-6">
                  {tv.overview}
                </p>
              ) : null}

              {/* Trailer button */}
              {trailer ? (
                <div className="mt-6">
                  <TrailerButton videoKey={trailer.key} />
                </div>
              ) : null}
            </div>
          </div>
        </div>

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

      {/* Videos grid */}
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
                href={`/tv/${r.id}`}
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
