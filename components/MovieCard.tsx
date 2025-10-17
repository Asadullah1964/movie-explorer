import Image from "next/image";

interface MovieCardProps {
  movie: any;
  onClick?: () => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <div onClick={onClick} className="cursor-pointer hover:scale-105 transition">
      <Image
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        width={300}
        height={450}
        className="rounded-xl shadow-md"
      />
      <h2 className="mt-2 text-lg font-semibold">{movie.title}</h2>
      <p className="text-sm text-gray-400">⭐ {movie.vote_average.toFixed(1)}</p>
    </div>
  );
}
