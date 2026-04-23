// lib/api.ts

// ============================
// 🔧 BASE CONFIG
// ============================
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

if (!API_KEY) {
  console.warn('⚠️ Warning: NEXT_PUBLIC_TMDB_API_KEY is missing. Add it to your .env file.');
}

// ============================
// 📦 TYPES
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

export interface TV {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
}

export interface PagedResponse<T> {
  page: number;
  total_pages: number;
  total_results: number;
  results: T[];
}

// ============================
//
// 🛡️ Helper
// ============================
export async function safeFetch<T = any>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 3600 }, ...init });
  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`TMDB API error ${res.status}: ${errorText}`);
  }
  return res.json();
}

// If you later move to server-side bearer auth, swap to:
// const headers = { Authorization: `Bearer ${process.env.TMDB_BEARER!}` };
// and remove &api_key=... from URLs.

// ============================
// 🎬 Movies
// ============================
export async function fetchMovies(page = 1) {
  return safeFetch<{ results: Movie[] }>(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`).then(d => d.results);
}

export async function fetchPopularMovies(page = 1): Promise<PagedResponse<Movie>> {
  return safeFetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
}

export async function fetchAllPopularMovies(): Promise<Movie[]> {
  const first = await fetchPopularMovies(1);
  const all = [...first.results];
  for (let p = 2; p <= first.total_pages; p++) {
    const next = await fetchPopularMovies(p);
    all.push(...next.results);
    // optional: await new Promise(r => setTimeout(r, 200));
  }
  return all;
}

export async function searchMovies(query: string, page = 1): Promise<Movie[]> {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
  return safeFetch<{ results: Movie[] }>(url).then(d => d.results);
}

export async function fetchMovieDetails(id: string) {
  return safeFetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,images,credits`);
}

export async function fetchTrendingMovies() {
  return safeFetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
}

export async function fetchLatestTrailers() {
  return safeFetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=1`);
}

export async function fetchFreeToWatch() {
  return safeFetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_watch_monetization_types=free`);
}

export async function fetchTopRatedMovies(page = 1): Promise<PagedResponse<Movie>> {
  return safeFetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`);
}

export async function fetchUpcomingMovies(page = 1): Promise<PagedResponse<Movie>> {
  return safeFetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=${page}`);
}

export async function fetchMoviesByGenre(genreId: number, page = 1): Promise<Movie[]> {
  return safeFetch<{ results: Movie[] }>(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`).then(d => d.results);
}

export async function fetchGenres(): Promise<{ id: number; name: string }[]> {
  return safeFetch<{ genres: { id: number; name: string }[] }>(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`).then(d => d.genres);
}

// ============================
// 📺 TV
// ============================
export async function fetchTrendingTV() {
  return safeFetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);
}

export async function fetchPopularTV(page = 1): Promise<PagedResponse<TV>> {
  return safeFetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`);
}

export async function fetchTopRatedTV(page = 1): Promise<PagedResponse<TV>> {
  return safeFetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}&page=${page}`);
}

export async function fetchOnAirTV(page = 1): Promise<PagedResponse<TV>> {
  return safeFetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&page=${page}`);
}

export async function fetchFreeToWatchTV(page = 1): Promise<PagedResponse<TV>> {
  return safeFetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_watch_monetization_types=free&page=${page}`);
}

// Unified paged fetcher that matches your existing auth style (api_key param)
export async function fetchTVPaged(
  path: string, // '/tv/popular', '/tv/top_rated', etc.
  page = 1,
  params: Record<string, string> = {}
): Promise<PagedResponse<TV>> {
  const qs = new URLSearchParams({ page: String(page), language: 'en-US', api_key: API_KEY as string, ...params });
  return safeFetch(`${BASE_URL}${path}?${qs.toString()}`);
}

// Series helpers (alias to TV)
export async function fetchTrendingSeries(page = 1) {
  const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
  return res.json();
}

export async function fetchPopularSeries(page = 1) {
  const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`);
  return res.json();
}

export async function fetchTopRatedSeries(page = 1) {
  const res = await fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}&page=${page}`);
  return res.json();
}

export async function fetchOnTheAirSeries(page = 1) {
  const res = await fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&page=${page}`);
  return res.json();
}



export async function searchAll(query: string) {
  if (!API_KEY) throw new Error("NEXT_PUBLIC_TMDB_API_KEY is not defined");

  const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
    query
  )}&language=en-US&page=1&include_adult=false`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch search results");
  const data = await res.json();

  // Filter only useful items
  return (data.results || []).filter(
    (item: any) =>
      item.media_type === "movie" || item.media_type === "tv" || item.media_type === "person"
  );
}