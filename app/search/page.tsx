// app/search/page.tsx
import { searchAll } from "@/lib/api";
import MovieCard from "@/components/MovieCard";
import SeriesCard from "@/components/SeriesCard";

interface SearchPageProps {
  searchParams: Promise<{ query?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { query } = await searchParams;
  const q = query || "";

  if (!q) {
    return (
      <div className="max-w-6xl mx-auto text-center py-20">
        <h1 className="text-3xl font-bold">Search Something!</h1>
        <p className="text-gray-500">Try searching for a movie, TV show, or series.</p>
      </div>
    );
  }

  const results = await searchAll(q);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Results for <span className="text-blue-500">“{q}”</span>
      </h1>

      {results.length === 0 ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results.map((item: any) =>
            item.media_type === "tv" ? (
              <SeriesCard key={`tv-${item.id}`} series={item} />
            ) : (
              <MovieCard key={`movie-${item.id}`} movie={item} />
            )
          )}
        </div>
      )}
    </div>
  );
}
