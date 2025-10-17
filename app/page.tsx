"use client";
import { useEffect, useState } from "react";
import { fetchMovies } from "@/lib/api";
import MovieCard from "@/components/MovieCard";

export default function HomePage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMovies()
      .then((data) => {
        if (Array.isArray(data)) setMovies(data);
        else setError("Failed to load movies.");
      })
      .catch(() => setError("Failed to load movies."));
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Popular Movies</h1>

      {error && <p className="text-red-500">{error}</p>}

      {movies.length === 0 && !error && (
        <p className="text-gray-500">Loading movies...</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </main>
  );
}
