"use client";

import { useEffect, useState } from "react";

interface Genre {
  id: number;
  name: string;
}

interface GenreFilterProps {
  selectedGenre: number | null;
  onSelectGenre: (genreId: number | null) => void;
}

export default function GenreFilter({ selectedGenre, onSelectGenre }: GenreFilterProps) {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    async function fetchGenres() {
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      const data = await res.json();
      setGenres(data.genres || []);
    }
    fetchGenres();
  }, []);

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <button
        onClick={() => onSelectGenre(null)}
        className={`px-4 py-2 rounded-full border text-sm transition ${
          selectedGenre === null
            ? "bg-blue-600 text-white border-blue-600"
            : "border-gray-400 text-gray-700 hover:bg-gray-200"
        }`}
      >
        All
      </button>

      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onSelectGenre(genre.id)}
          className={`px-4 py-2 rounded-full border text-sm transition ${
            selectedGenre === genre.id
              ? "bg-blue-600 text-white border-blue-600"
              : "border-gray-400 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}
