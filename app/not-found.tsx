import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center px-6">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-on-surface">404</h1>
        <p className="mb-6 text-sm text-on-surface-variant">
          Кажется мне, что вы куда-то не туда тыкнули.
          <br /> Либо эта странциа еще в разработке.
        </p>

        <Link
          href="/"
          className="rounded-md bg-surface-container px-4 py-2 text-sm hover:bg-surface-container-high"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
