export default function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-2xl font-bold mb-4 mt-8 border-l-4 border-blue-500 pl-3">
      {title}
    </h2>
  );
}
