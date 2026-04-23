"use client";

import { useEffect, useState } from "react";
import {
  fetchTrendingSeries,
  fetchPopularSeries,
  fetchTopRatedSeries,
  fetchOnTheAirSeries,
} from "@/lib/api";
import SeriesCard from "@/components/SeriesCard";

export default function SeriesPage() {
  const [trending, setTrending] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [onAir, setOnAir] = useState<any[]>([]);

  const [trendingPage, setTrendingPage] = useState(1);
  const [popularPage, setPopularPage] = useState(1);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [onAirPage, setOnAirPage] = useState(1);

  const [trendingTotalPages, setTrendingTotalPages] = useState(1);
  const [popularTotalPages, setPopularTotalPages] = useState(1);
  const [topRatedTotalPages, setTopRatedTotalPages] = useState(1);
  const [onAirTotalPages, setOnAirTotalPages] = useState(1);

  useEffect(() => {
    fetchTrendingSeries(trendingPage).then((data) => {
      setTrending(data.results || []);
      setTrendingTotalPages(data.total_pages || 1);
    });
  }, [trendingPage]);

  useEffect(() => {
    fetchPopularSeries(popularPage).then((data) => {
      setPopular(data.results || []);
      setPopularTotalPages(data.total_pages || 1);
    });
  }, [popularPage]);

  useEffect(() => {
    fetchTopRatedSeries(topRatedPage).then((data) => {
      setTopRated(data.results || []);
      setTopRatedTotalPages(data.total_pages || 1);
    });
  }, [topRatedPage]);

  useEffect(() => {
    fetchOnTheAirSeries(onAirPage).then((data) => {
      setOnAir(data.results || []);
      setOnAirTotalPages(data.total_pages || 1);
    });
  }, [onAirPage]);

  return (
    <main className="p-8 space-y-12">
      <section>
        <h1 className="mb-6 text-3xl font-bold">🔥 Trending Series</h1>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {trending.map((series) => (
            <SeriesCard key={series.id} series={series} />
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setTrendingPage((p) => Math.max(1, p - 1))}
            disabled={trendingPage === 1}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {trendingPage} of {trendingTotalPages}
          </span>
          <button
            onClick={() =>
              setTrendingPage((p) => Math.min(trendingTotalPages, p + 1))
            }
            disabled={trendingPage === trendingTotalPages}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-3xl font-bold">🌟 Popular Series</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {popular.map((series) => (
            <SeriesCard key={series.id} series={series} />
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setPopularPage((p) => Math.max(1, p - 1))}
            disabled={popularPage === 1}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {popularPage} of {popularTotalPages}
          </span>
          <button
            onClick={() =>
              setPopularPage((p) => Math.min(popularTotalPages, p + 1))
            }
            disabled={popularPage === popularTotalPages}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-3xl font-bold">🏆 Top Rated Series</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {topRated.map((series) => (
            <SeriesCard key={series.id} series={series} />
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setTopRatedPage((p) => Math.max(1, p - 1))}
            disabled={topRatedPage === 1}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {topRatedPage} of {topRatedTotalPages}
          </span>
          <button
            onClick={() =>
              setTopRatedPage((p) => Math.min(topRatedTotalPages, p + 1))
            }
            disabled={topRatedPage === topRatedTotalPages}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-3xl font-bold">📺 Currently Airing</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {onAir.map((series) => (
            <SeriesCard key={series.id} series={series} />
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setOnAirPage((p) => Math.max(1, p - 1))}
            disabled={onAirPage === 1}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {onAirPage} of {onAirTotalPages}
          </span>
          <button
            onClick={() =>
              setOnAirPage((p) => Math.min(onAirTotalPages, p + 1))
            }
            disabled={onAirPage === onAirTotalPages}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}