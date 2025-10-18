import Image from "next/image";

export default function TVCard({ show }: { show: any }) {
  return (
    <div className="rounded-lg overflow-hidden shadow-md bg-gray-900 hover:scale-105 transition-transform">

      {show.poster_path ? (
  <Image
        src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
        alt={show.name || "TV show poster"}
        width={300}
        height={450}
        className="object-cover w-full h-auto"
      />
) : (
  <div>No Image Available</div>
)}

      <div className="p-3">
        <h3 className="text-sm font-semibold">{show.name}</h3>
        <p className="text-xs text-gray-400">{show.first_air_date}</p>
      </div>
    </div>
  );
}
