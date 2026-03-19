"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="font-serif text-xl text-[#083335]">Something went wrong</h2>
      <p className="max-w-md text-sm text-[#4B5A56]">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-[#083335] px-4 py-2 text-white transition hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
