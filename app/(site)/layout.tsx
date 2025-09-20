import Link from "next/link";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-gray-900">
            SP Gallery
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-gray-600">
            <Link href="/projects" className="hover:text-gray-900">
              Projects
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-4 text-xs text-gray-500">
          © {currentYear} SP Gallery. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

