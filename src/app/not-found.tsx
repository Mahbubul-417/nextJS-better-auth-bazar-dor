import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#f0f5f0] px-5 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#e3ebe3] bg-white p-8 text-center shadow-sm">
        <div className="text-6xl">🔎</div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          পেজটি খুঁজে পাওয়া যায়নি
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          আপনি যে পেজটি খুঁজছেন সেটি নেই, সরানো হয়েছে, অথবা ঠিকানাটি ভুল।
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-[#ccff00] px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-[#b9eb00]"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}