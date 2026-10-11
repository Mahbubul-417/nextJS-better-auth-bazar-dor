
"use client";

import Link from "next/link";

export default function SignInPage() {
  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-[#f6f9f5] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
              🛒
            </span>
            <span className="text-2xl font-bold text-green-800">
              বাজার দর
            </span>
          </Link>

          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            আবার ফিরে আসুন!
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            আপনার অ্যাকাউন্টে সাইন ইন করুন
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
              ইমেইল ঠিকানা
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="আপনার ইমেইল লিখুন"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm font-medium text-green-700 hover:text-green-800"
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            সাইন ইন করুন
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">অথবা</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <span className="font-bold text-base">G</span>
            Google
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <span className="font-bold text-base">⌘</span>
            GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/signup" className="font-semibold text-green-700 hover:underline">
            সাইন আপ করুন
          </Link>
        </p>
      </div>
    </section>
  );
}
