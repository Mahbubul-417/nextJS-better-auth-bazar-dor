"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

const BASE_URL = "https://openapi.programming-hero.com/api/bazardor";

function getBengaliDate() {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function toBengaliNumber(value: number) {
  const bengaliDigits = "০১২৩৪৫৬৭৮৯";
  return String(value).replace(/\d/g, (digit) => bengaliDigits[Number(digit)]);
}

function getUnitName(unit: string) {
  const units: Record<string, string> = {
    kg: "কেজি",
    liter: "লিটার",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
    pcs: "পিস",
  };

  return units[unit] ?? unit;
}

export default function Navbar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    async function loadNavbarData() {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          fetch(`${BASE_URL}/categories`),
          fetch(`${BASE_URL}/products`),
        ]);

        if (!categoriesResponse.ok || !productsResponse.ok) {
          throw new Error("Failed to fetch navbar data");
        }

        const categoriesData = await categoriesResponse.json();
        const productsData = await productsResponse.json();

        setCategories(
          Array.isArray(categoriesData)
            ? categoriesData
            : categoriesData.categories ?? []
        );

        setProducts(
          Array.isArray(productsData)
            ? productsData
            : productsData.products ?? []
        );
      } catch (error) {
        console.error("Failed to load navbar data:", error);
      }
    }

    loadNavbarData();
  }, []);

  async function handleSignOut() {
    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        console.error("Sign-out failed:", error);
        toast.error(error.message || "লগ আউট করা যায়নি। আবার চেষ্টা করুন।");
        return;
      }

      toast.success("সফলভাবে লগ আউট হয়েছে!");
    } catch (error) {
      console.error("Sign-out failed:", error);
      toast.error("লগ আউট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoggingOut(false);
    }
  }

  const date = getBengaliDate();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex min-h-[76px] items-center justify-between gap-4">
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600">
                <Image
                  src="/images/logo-icon.png"
                  alt="বাজার দর"
                  width={30}
                  height={30}
                  priority
                />
              </div>

              <div>
                <h1 className="text-xl font-bold leading-none text-gray-800 sm:text-2xl">
                  বাজার দর
                </h1>
                <p className="mt-1 text-xs text-gray-500">{date}</p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {isPending ? (
                <span className="text-sm text-gray-500">লোড হচ্ছে...</span>
              ) : session?.user ? (
                <>
                  <span className="hidden max-w-36 truncate text-sm font-medium text-gray-700 sm:block">
                    {session.user.name || session.user.email}
                  </span>

                  <Link
                    href="/profile"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
                  >
                    My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={loggingOut}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-red-300 hover:text-red-600 disabled:opacity-60 sm:px-4"
                  >
                    {loggingOut ? "লগ আউট হচ্ছে..." : "লগ আউট"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="hidden px-3 py-2 text-sm font-medium text-gray-700 transition hover:text-green-600 sm:block sm:px-4"
                  >
                    সাইন ইন
                  </Link>

                  <Link
                    href="/signup"
                    className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700 sm:px-5"
                  >
                    সাইন আপ
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <nav className="border-t border-gray-100">
          <div className="mx-auto max-w-6xl overflow-x-auto px-4">
            <div className="flex min-w-max items-center">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-sm text-gray-600 transition hover:border-green-300 hover:text-green-700"
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.nameBn}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

    
      <div className="overflow-hidden border-t border-gray-100 bg-gray-50">
        <div className="flex w-max animate-[marquee_30s_linear_infinite]">
          {[...products, ...products].map((product, index) => {
            const isUp = product.change.dir === "up";
            const isDown = product.change.dir === "down";

            return (
              <div
                key={`${product.id}-${index}`}
                className="flex items-center gap-2 border-r border-gray-200 px-5 py-2.5 text-sm"
              >
                <span>{product.categoryIcon}</span>
                <span className="text-gray-700">{product.nameBn}</span>

                <span className="font-medium text-gray-800">
                  {toBengaliNumber(product.today)} টাকা/
                  {getUnitName(product.unit)}
                </span>

                <span
                  className={`font-semibold ${
                    isUp
                      ? "text-red-500"
                      : isDown
                        ? "text-green-600"
                        : "text-gray-500"
                  }`}
                >
                  {isUp
                    ? `▲ ${toBengaliNumber(product.change.pct)}%`
                    : isDown
                      ? `▼ ${toBengaliNumber(product.change.pct)}%`
                      : "— ০.০%"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
