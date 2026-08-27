import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl font-bold tracking-tight">
            Track your money.
            <br />
            Understand your spending.
          </h1>

          <p className="mt-6 text-lg text-indigo-100">
            A simple personal expense tracker built with
            Next.js and Supabase.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-indigo-600 transition hover:bg-gray-100"
            >
              Get Started
            </Link>

            <Link
              href="/login"
              className="rounded-lg border border-white px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}