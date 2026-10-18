"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="p-10 text-center text-gray-500">
        প্রোফাইল লোড হচ্ছে...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="p-10 text-center">
        <p className="mb-4 text-gray-700">
          প্রোফাইল দেখতে আগে সাইন ইন করুন।
        </p>
        <Link
          href="/signin"
          className="rounded-lg bg-green-700 px-5 py-3 text-white hover:bg-green-800"
        >
          সাইন ইন করুন
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-[75vh] bg-[#f6f9f5] px-4 py-12">
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          My Profile
        </h1>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-gray-800">
              {session.user.name || "নাম দেওয়া নেই"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-800">
              {session.user.email}
            </p>
          </div>

          <Link
            href="/profile/update"
            className="inline-block rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Update
          </Link>
        </div>
      </div>
    </section>
  );
}
