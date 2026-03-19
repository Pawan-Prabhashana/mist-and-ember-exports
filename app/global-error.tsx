"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F6F3EE] px-6 text-center">
        <h1 className="font-serif text-2xl text-[#083335]">Something went wrong</h1>
        <p className="max-w-md text-[#4B5A56]">{error.message}</p>
        <button
          onClick={reset}
          className="rounded-lg bg-[#083335] px-4 py-2 text-white transition hover:opacity-90"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
