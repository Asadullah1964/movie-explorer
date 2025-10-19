"use client";

import { useEffect, useRef, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import TVCard from "@/components/TVCard";
import {
  fetchTrendingTV,
  fetchPopularTV,
  fetchTopRatedTV,
  fetchOnAirTV,
  fetchFreeToWatchTV,
  fetchTVPaged,
} from "@/lib/api";

type TV = any;

export default function TVShowsPage() {
  // Initial buckets (no carousels)
  const [trending, setTrending] = useState<TV[]>([]);
  const [popular, setPopular] = useState<TV[]>([]);
  const [topRated, setTopRated] = useState<TV[]>([]);
  const [onAir, setOnAir] = useState<TV[]>([]);
  const [freeToWatch, setFreeToWatch] = useState<TV[]>([]);

  // Infinite scroll state for one chosen feed (e.g., Popular)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [popularPaged, setPopularPaged] = useState<TV[]>([]);
  const sentryRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    (async () => {
      const [trend, pop, top, air, free] = await Promise.all([
        fetchTrendingTV(),
        fetchPopularTV(),
        fetchTopRatedTV(),
        fetchOnAirTV(),
        fetchFreeToWatchTV(),
      ]);
      setTrending(trend?.results ?? []);
      setPopular(pop?.results ?? []);
      setTopRated(top?.results ?? []);
      setOnAir(air?.results ?? []);
      setFreeToWatch(free?.results ?? []);
      // Seed the paged list with first page of popular
      setPopularPaged(pop?.results ?? []);
      setHasMore((pop?.page ?? 1) < (pop?.total_pages ?? 1));
      setPage((pop?.page ?? 1) + 1);
    })();
  }, []);

  // IntersectionObserver for infinite scroll on the Popular grid
  useEffect(() => {
    if (!sentryRef.current) return;
    const el = sentryRef.current;

    const io = new IntersectionObserver(
      async (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (loadingRef.current) return;
        if (!hasMore) return;

        loadingRef.current = true;
        try {
          const data = await fetchTVPaged("/tv/popular", page);
          setPopularPaged((prev) => [...prev, ...(data?.results ?? [])]);
          const nextPage = (data?.page ?? page) + 1;
          setPage(nextPage);
          setHasMore((data?.page ?? 1) < (data?.total_pages ?? 1));
        } finally {
          loadingRef.current = false;
        }
      },
      {
        root: null,
        rootMargin: "320px 0px", // prefetch before reaching the end
        threshold: 0,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [page, hasMore]);

  const uniquePopular = Object.values(
    popularPaged.reduce((acc: Record<number, any>, cur: any) => {
      acc[cur.id] = cur;
      return acc;
    }, {})
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 bg-background text-foreground">
      {/* Trending (grid) */}
      <section className="space-y-4">
        <SectionTitle title="Trending TV Shows" />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {trending.map((show) => (
            <TVCard key={show.id} show={show} />
          ))}
        </div>
      </section>

      {/* Popular (initial grid only) */}
      <section className="mt-10 space-y-4">
        <SectionTitle title="Popular Shows" />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {popular.map((show) => (
            <TVCard key={`pop-init-${show.id}`} show={show} />
          ))}
        </div>
      </section>

      {/* Top Rated */}
      <section className="mt-10 space-y-4">
        <SectionTitle title="Top Rated Shows" />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {topRated.map((show) => (
            <TVCard key={show.id} show={show} />
          ))}
        </div>
      </section>

      {/* Currently Airing */}
      <section className="mt-10 space-y-4">
        <SectionTitle title="Currently Airing" />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {onAir.map((show) => (
            <TVCard key={show.id} show={show} />
          ))}
        </div>
      </section>

      {/* Free to Watch */}
      <section className="mt-10 space-y-4">
        <SectionTitle title="Free to Watch" />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {freeToWatch.map((show) => (
            <TVCard key={show.id} show={show} />
          ))}
        </div>
      </section>

      {/* Infinite Popular (paged) */}
      <section className="mt-10 space-y-4">
        <SectionTitle title="More Popular (Endless)" />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {uniquePopular.map((show) => (
            <TVCard key={show.id} show={show} />
          ))}
        </div>
        {/* Sentry for infinite scroll */}
        <div ref={sentryRef} className="h-8 w-full" />
        {!hasMore ? (
          <p className="mt-2 text-center text-sm text-muted">
            No more results.
          </p>
        ) : null}
      </section>
    </main>
  );
}
