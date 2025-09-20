import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col items-start gap-6 px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">Welcome to SP Gallery</h1>
      <p className="text-base text-gray-600">
        Browse a curated selection of civil, residential, and commercial projects. Dive into the full image galleries to see
        what the team has been building recently.
      </p>
      <Link
        href="/projects"
        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
      >
        View Projects
      </Link>
    </main>
  );
}
