"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  change: {
    dir: string;
    pct: number;
  };
};

type Category = {
  id?: number | string;
  slug: string;
  nameBn: string;
  icon?: string;
};

type SortOption = "default" | "low" | "high";

const API_URL =
  // "https://api.api-store.workers.dev/api/bazardor";
  "https://openapi.programming-hero.com/api/bazardor"

function toBengaliNumber(value: number) {
  return value.toLocaleString("bn-BD");
}

function formatPrice(value: number) {
  return `৳${toBengaliNumber(value)}`;
}

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [sort, setSort] = useState<SortOption>("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCategoryProducts() {
      try {
        setLoading(true);
        setError(false);

        const apiUrls = [
          "https://openapi.programming-hero.com/api/bazardor",
          "https://api.api-store.workers.dev/api/bazardor",
          "https://api.abcz.workers.dev/api/bazardor",
        ];

        let productList: Product[] | null = null;
        let categoryList: Category[] = [];

        for (const apiUrl of apiUrls) {
          try {
            const response = await fetch(`${apiUrl}/products`, {
              signal: controller.signal,
            });

            if (!response.ok) continue;

            const data = await response.json();

            const allProducts: Product[] = Array.isArray(data)
              ? data
              : data.products ?? [];

            if (allProducts.length === 0) continue;

            productList = allProducts.filter(
              (item) => item.category === slug
            );

            try {
              const categoryResponse = await fetch(
                `${apiUrl}/categories`,
                { signal: controller.signal }
              );

              if (categoryResponse.ok) {
                const categoryData = await categoryResponse.json();

                categoryList = Array.isArray(categoryData)
                  ? categoryData
                  : categoryData.categories ?? [];
              }
            } catch {
              
            }

            break;
          } catch (err) {
            if (err instanceof Error && err.name === "AbortError") {
              return;
            }
          }
        }

        if (productList === null) {
          throw new Error("Both product APIs failed");
        }

        const foundCategory = categoryList.find(
          (item) => item.slug === slug
        );

        setProducts(productList);

        setCategory(
          foundCategory ??
          (productList.length > 0
            ? {
              slug,
              nameBn: productList[0].categoryNameBn,
              icon: productList[0].categoryIcon,
            }
            : null)
        );
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      fetchCategoryProducts();
    }

    return () => controller.abort();
  }, [slug]);

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sort === "low") {
      result.sort((a, b) => a.today - b.today);
    } else if (sort === "high") {
      result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [products, sort]);

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#f0f5f0] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl animate-pulse space-y-4">
          <div className="h-24 rounded-xl bg-white" />
          <div className="h-12 rounded-xl bg-white" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-52 rounded-xl bg-white"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f0f5f0] px-5 text-center">
        <span className="text-4xl">⚠️</span>
        <h1 className="mt-4 text-xl font-bold text-gray-800">
          পণ্য লোড করা যায়নি
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-5 rounded-lg bg-[#ccff00] px-5 py-2.5 text-sm font-semibold"
        >
          আবার চেষ্টা করুন
        </button>
      </main>
    );
  }

  if (!category && products.length === 0) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f0f5f0] px-5 text-center">
        <span className="text-5xl">🔎</span>
        <h1 className="mt-4 text-xl font-bold text-gray-800">
          ক্যাটাগরি পাওয়া যায়নি
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          এই ক্যাটাগরিটি নেই অথবা এতে কোনো পণ্য নেই।
        </p>
        <Link
          href="/"
          className="mt-5 rounded-lg bg-[#ccff00] px-5 py-2.5 text-sm font-semibold text-gray-900"
        >
          সব পণ্য দেখুন
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-[#f0f5f0] px-3 py-5 sm:px-5 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <nav className="text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-900">
            হোম
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">
            {category?.nameBn ?? "ক্যাটাগরি"}
          </span>
        </nav>

        <section className="flex items-center gap-3 rounded-xl border border-[#e3ebe3] bg-[#fbfcfa] p-4 sm:p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eef4ee] text-2xl">
            {category?.icon ?? "🛒"}
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#263329] sm:text-2xl">
              {category?.nameBn ?? "ক্যাটাগরি"}
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              {toBengaliNumber(products.length)}টি পণ্য
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-[#e3ebe3] bg-[#fbfcfa] p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-[#263329]">
              এই ক্যাটাগরির পণ্য
            </h2>

            <label className="flex items-center gap-2 text-xs text-gray-600">
              সাজান:
              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as SortOption)
                }
                className="rounded-lg border border-[#dce5dc] bg-white px-3 py-2 text-xs outline-none focus:border-green-600"
              >
                <option value="default">ডিফল্ট</option>
                <option value="low">দাম: কম থেকে বেশি</option>
                <option value="high">দাম: বেশি থেকে কম</option>
              </select>
            </label>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="py-16 text-center">
              <span className="text-4xl">🛒</span>
              <p className="mt-3 text-sm text-gray-500">
                এই ক্যাটাগরিতে কোনো পণ্য নেই।
              </p>
              <Link
                href="/"
                className="mt-4 inline-block text-sm font-semibold text-gray-800 underline"
              >
                হোমে ফিরে যান
              </Link>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {sortedProducts.map((product) => {
                const isUp = product.change.dir === "up";
                const isDown = product.change.dir === "down";

                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group rounded-xl border border-[#e3ebe3] bg-[#fbfcfa] p-3 transition hover:-translate-y-0.5 hover:border-[#cbd8cb] hover:shadow-sm sm:p-4"
                  >
                    <div className="flex h-20 items-center justify-center rounded-lg bg-[#eef4ee] text-4xl sm:h-28 sm:text-5xl">
                      {product.image || product.categoryIcon || "🛒"}
                    </div>

                    <h3 className="mt-3 line-clamp-2 text-sm font-bold text-[#263329] group-hover:text-green-700">
                      {product.nameBn}
                    </h3>

                    <p className="mt-1 text-[11px] text-gray-500">
                      প্রতি {product.unit}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-1">
                      <span className="text-base font-bold text-[#263329]">
                        {formatPrice(product.today)}
                      </span>

                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${isUp
                            ? "bg-red-50 text-red-700"
                            : isDown
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
                        {toBengaliNumber(product.change.pct)}%
                      </span>
                    </div>

                    <p className="mt-3 border-t border-[#e3ebe3] pt-2 text-[11px] text-gray-500">
                      বিস্তারিত দেখুন →
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}