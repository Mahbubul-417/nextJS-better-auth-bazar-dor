"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const updatedName = name.trim();

    if (!updatedName) {
      toast.error("আপনার নাম লিখুন।");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.updateUser({
        name: updatedName,
      });

      if (error) {
        toast.error(error.message || "তথ্য আপডেট করা যায়নি।");
        return;
      }

      toast.success("আপনার তথ্য সফলভাবে আপডেট হয়েছে!");
      router.push("/profile");
      router.refresh();
    } catch {
      toast.error("তথ্য আপডেট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

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
          তথ্য আপডেট করতে আগে সাইন ইন করুন।
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
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Update Profile
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          আপনার নাম পরিবর্তন করুন।
        </p>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={session.user.name || "আপনার নাম লিখুন"}
              autoComplete="name"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "আপডেট হচ্ছে..." : "আপনার নাম পরিবর্তন করুন"}
          </button>

          <Link
            href="/profile"
            className="block text-center text-sm font-medium text-gray-600 hover:text-green-700"
          >
            ফিরে যান
          </Link>
        </form>
      </div>
    </section>
  );
}
