"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

const BASE_URL =
  "https://api.api-store.workers.dev/api/bazardor";

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

  return String(value).replace(
    /\d/g,
    (digit) => bengaliDigits[Number(digit)]
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

export default function Navbar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadNavbarData() {
      try {
        const [categoriesResponse, productsResponse] =
          await Promise.all([
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

  const date = getBengaliDate();

  return (
    <header className="bg-white border-b border-gray-200">

      
      <div className="max-w-6xl mx-auto px-4">
        <div className="min-h-[76px] flex items-center justify-between gap-4">

          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
          >
            <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
              <Image
                src="/images/logo-icon.png"
                alt="বাজার দর"
                width={30}
                height={30}
                priority
              />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 leading-none">
                বাজার দর
              </h1>

              <p className="text-xs text-gray-500 mt-1">
                {date}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/signin"
              className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition"
            >
              সাইন ইন
            </Link>

            <Link
              href="/signup"
              className="px-3 sm:px-5 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
            >
              সাইন আপ
            </Link>
          </div>
        </div>
      </div>

      
      <nav className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
          <div className="flex items-center min-w-max">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition ${
                  index === 0
                    ? "text-green-700 font-semibold border-green-600"
                    : "text-gray-600 border-transparent hover:text-green-700 hover:border-green-300"
                }`}
              >
                <span className="mr-1">
                  {category.icon}
                </span>

                {category.nameBn}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      
      <div className="border-t border-gray-100 bg-gray-50 overflow-hidden">
        <div className="flex w-max animate-[marquee_30s_linear_infinite]">

          {[...products, ...products].map((product, index) => {
            const isUp = product.change.dir === "up";
            const isDown = product.change.dir === "down";

            return (
              <div
                key={`${product.id}-${index}`}
                className="flex items-center gap-2 px-5 py-2.5 border-r border-gray-200 text-sm"
              >
                <span>{product.categoryIcon}</span>

                <span className="text-gray-700">
                  {product.nameBn}
                </span>

                <span className="font-medium text-gray-800">
                  {toBengaliNumber(product.today)} টাকা/
                  {getUnitName(product.unit)}
                </span>

                <span
                  className={`font-semibold ${
                    isUp
                      ? "text-green-600"
                      : isDown
                        ? "text-red-500"
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

    </header>
  );
}