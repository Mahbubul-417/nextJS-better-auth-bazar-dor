"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Banner from "@/components/Banner";

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
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
    icon: string;
  };
};

const API_URL ="https://api.api-store.workers.dev/api/bazardor/products";

function toBengaliNumber(value: number | string) {
  const digits = "০১২৩৪৫৬৭৮৯";

  return String(value).replace(
    /\d/g,
    (digit) => digits[Number(digit)]
  );
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



function getPercentage(product: Product) {
  if (product.change?.dir === "up") {
    return Math.abs(product.change.pct);
  }

  if (product.change?.dir === "down") {
    return -Math.abs(product.change.pct);
  }

  return 0;
}

function ProductCard({ product }: { product: Product }) {
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group rounded-2xl border border-gray-200 bg-white p-4 transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-50 text-3xl">
          {product.image || product.categoryIcon || "🛒"}
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isUp
              ? "bg-red-50 text-red-700"
              : isDown
                ? "bg-green-50 text-green-600"
                : "bg-gray-100 text-gray-600"
            }`}
        >
          {isUp
            ? `▲ ${toBengaliNumber(product.change.pct)}%`
            : isDown
              ? `▼  ${toBengaliNumber(product.change.pct)}%`
              : "— ০%"}
        </span>
      </div>

      <p className="mt-4 text-xs font-medium text-green-700">
        {product.categoryIcon} {product.categoryNameBn}
      </p>

      <h3 className="mt-1 text-lg font-bold text-gray-800 transition group-hover:text-green-700">
        {product.nameBn}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        প্রতি {getUnitName(product.unit)}
      </p>

      <div className="mt-4 flex items-end justify-between gap-2 border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-500">আজকের দাম</p>
          <p className="mt-1 text-xl font-bold text-gray-900">
            ৳{toBengaliNumber(product.today)}
          </p>
        </div>

        <span className="text-sm font-medium text-green-700 group-hover:underline">
          বিস্তারিত →
        </span>
      </div>
    </Link>
  );
}

function ProductSection({
  title,
  subtitle,
  products,
  icon,
  emptyMessage,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  icon: string;
  emptyMessage: string;
}) {
  return (
    <section className="py-8 sm:py-10">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {title}
            </h2>
          </div>

          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="rounded-xl bg-gray-50 p-6 text-center text-gray-500">
          {emptyMessage}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex justify-between">
        <div className="h-14 w-14 rounded-xl bg-gray-200" />
        <div className="h-6 w-16 rounded-full bg-gray-200" />
      </div>

      <div className="mt-5 h-3 w-20 rounded bg-gray-200" />
      <div className="mt-3 h-5 w-3/4 rounded bg-gray-200" />
      <div className="mt-3 h-4 w-1/3 rounded bg-gray-200" />

      <div className="mt-6 border-t border-gray-100 pt-4">
        <div className="h-3 w-20 rounded bg-gray-200" />
        <div className="mt-2 h-6 w-24 rounded bg-gray-200" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
        }

        const data = await response.json();

        const productList: Product[] = Array.isArray(data)
          ? data
          : data.products ?? [];

        setProducts(productList);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setError("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

  const risers = [...products]
    .filter((product) => getPercentage(product) > 0)
    .sort((a, b) => getPercentage(b) - getPercentage(a))
    .slice(0, 6);

  const fallers = [...products]
    .filter((product) => getPercentage(product) < 0)
    .sort((a, b) => getPercentage(a) - getPercentage(b))
    .slice(0, 6);

  return (
    <main>
      
      <Banner></Banner>

     
      <div className="mx-auto max-w-6xl px-4">
        {error ? (
          <div className="my-10 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-700">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white hover:bg-green-700"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : loading ? (
          <>
            {["দাম বাড়ছে", "দাম কমছে", "সব পণ্য"].map((title) => (
              <section key={title} className="py-8">
                <div className="mb-6 h-7 w-48 animate-pulse rounded bg-gray-200" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))}
                </div>
              </section>
            ))}
          </>
        ) : products.length === 0 ? (
          <div className="my-10 rounded-2xl bg-gray-50 p-10 text-center">
            <p className="text-lg font-semibold text-gray-800">
              কোনো পণ্যের তথ্য পাওয়া যায়নি।
            </p>
          </div>
        ) : (
          <>
            <ProductSection
              title="যেসব পণ্যের দাম বাড়ছে"
              subtitle="গতকালের তুলনায় যেসব পণ্যের দাম বেড়েছে"
              products={risers}
              icon="🔺"
      
              emptyMessage="এই মুহূর্তে দাম বাড়ার তথ্য পাওয়া যায়নি।"
            />

            <div className="border-t border-gray-100" />

            <ProductSection
              title="যেসব পণ্যের দাম কমছে"
              subtitle="গতকালের তুলনায় যেসব পণ্যের দাম কমেছে"
              products={fallers}
              
             icon="▼" 
              emptyMessage="এই মুহূর্তে দাম কমার তথ্য পাওয়া যায়নি।"
            />

            <div className="border-t border-gray-100" />

            <section id="সব-পণ্য" className="scroll-mt-6 py-8 sm:py-10">
              <div className="mb-6">


                <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                  সব পণ্য
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  মোট {toBengaliNumber(products.length)}টি পণ্যের বর্তমান দাম
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 pb-12 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}