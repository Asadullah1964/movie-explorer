// lib/api.ts

// ============================
// 🔧 BASE CONFIG
// ============================
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

if (!API_KEY) {
  console.warn(
    "⚠️ Warning: NEXT_PUBLIC_TMDB_API_KEY is missing. Add it to your .env file."
  );
}

// ============================
// 📦 TYPES (for better clarity)
// ============================
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number;
  genre_ids?: number[];
}

export interface MoviePageResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: Movie[];
}

// ============================
// 🛡️ Helper Function
// ============================
export async function safeFetch(url: string) {
  const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`TMDB API error ${res.status}: ${errorText}`);
  }
  return res.json();
}

// ============================
// 🎬 Core API Functions
// ============================
// ✅ Exported function (used in your page)
export async function fetchMovies(page = 1) {
  const data = await safeFetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
  return data.results;
}
/**
 * Fetches one page of popular movies.
 */
export async function fetchPopularMovies(page = 1): Promise<MoviePageResponse> {
  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
  return safeFetch(url);
}

/**
 * Fetches ALL popular movies (⚠️ heavy, use with care).
 */
export async function fetchAllPopularMovies(): Promise<Movie[]> {
  const firstPage = await fetchPopularMovies(1);
  const allMovies = [...firstPage.results];

  for (let p = 2; p <= firstPage.total_pages; p++) {
    const next = await fetchPopularMovies(p);
    allMovies.push(...next.results);
    // optional: await new Promise(r => setTimeout(r, 200)); // prevent rate limit
  }

  return allMovies;
}

/**
 * Search movies by query string.
 */
export async function searchMovies(query: string, page = 1): Promise<Movie[]> {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
    query
  )}&page=${page}`;
  const data = await safeFetch(url);
  return data.results;
}

// Fetch specific movie details
export async function fetchMovieDetails(id: string) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,images,credits`
  );
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}

// ============================
// 🍿 Extra Endpoints (optional but useful)
// ============================

/**
 * Get trending movies (daily or weekly).
 * timeWindow = "day" | "week"
 */
// Trending Movies
export async function fetchTrendingMovies() {
  const url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`;
  return safeFetch(url);
}

// Latest Trailers
export async function fetchLatestTrailers() {
  const url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=1`;
  return safeFetch(url);
}

// Free to Watch (You can customize using discover endpoint)
export async function fetchFreeToWatch() {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_watch_monetization_types=free`;
  return safeFetch(url);
}

/**
 * Get top-rated movies.
 */
export async function fetchTopRatedMovies(page = 1): Promise<MoviePageResponse> {
  const url = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`;
  return safeFetch(url);
}

/**
 * Get upcoming movies.
 */
export async function fetchUpcomingMovies(page = 1): Promise<MoviePageResponse> {
  const url = `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=${page}`;
  return safeFetch(url);
}

/**
 * Get movies by genre.
 */
export async function fetchMoviesByGenre(
  genreId: number,
  page = 1
): Promise<Movie[]> {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`;
  const data = await safeFetch(url);
  return data.results;
}

/**
 * Get list of genres.
 */
export async function fetchGenres(): Promise<
  { id: number; name: string }[]
> {
  const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`;
  const data = await safeFetch(url);
  return data.genres;
}








// ============================
// TV relates apis
// ---------------- TV SHOWS ----------------

// Trending TV Shows
export async function fetchTrendingTV() {
  const url = `${BASE_URL}/trending/tv/week?api_key=${API_KEY}`;
  return safeFetch(url);
}

// Popular TV Shows
export async function fetchPopularTV(page = 1) {
  const url = `${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`;
  return safeFetch(url);
}

// Top Rated TV Shows
export async function fetchTopRatedTV(page = 1) {
  const url = `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&page=${page}`;
  return safeFetch(url);
}

// Currently Airing
export async function fetchOnAirTV(page = 1) {
  const url = `${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&page=${page}`;
  return safeFetch(url);
}

// Free to Watch TV (simulated)
export async function fetchFreeToWatchTV() {
  const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_watch_monetization_types=free`;
  return safeFetch(url);
}




// ✅ Series-specific endpoints
export async function fetchTrendingSeries() {
  const data = await safeFetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);
  return data.results;
}

export async function fetchPopularSeries() {
  const data = await safeFetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
  return data.results;
}

export async function fetchTopRatedSeries() {
  const data = await safeFetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`);
  return data.results;
}

export async function fetchOnTheAirSeries() {
  const data = await safeFetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}`);
  return data.results;
}

export async function fetchSeriesDetails(id: string) {
  const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
  return res.json();
}