"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Market = {
    market: string;
    division: string;
    min: number;
    max: number;
};

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
        dir: string;
        pct: number;
    };
    markets: Market[];
};

const API_URL = "https://api.api-store.workers.dev/api/bazardor";

function toBengaliNumber(value: number) {
    return value.toLocaleString("bn-BD");
}

function formatPrice(value: number) {
    return `৳${toBengaliNumber(value)}`;
}

export default function ProductDetailPage() {
    const params = useParams<{ slug: string }>();
    const slug = params.slug;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchProduct() {
            try {
                setLoading(true);
                setError(false);

                const response = await fetch(`${API_URL}/products`, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();

                const products: Product[] = Array.isArray(data)
                    ? data
                    : data.products ?? [];

                const foundProduct = products.find(
                    (item) => item.slug === slug
                );

                if (!foundProduct) {
                    throw new Error("Product not found");
                }

                setProduct(foundProduct);
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
            fetchProduct();
        }

        return () => controller.abort();
    }, [slug]);

    if (loading) {
        return (
            <main className="min-h-[70vh] bg-[#f0f5f0] px-4 py-8 sm:px-6">
                <div className="mx-auto max-w-6xl animate-pulse space-y-4">
                    <div className="h-24 rounded-xl bg-white" />
                    <div className="h-24 rounded-xl bg-white" />
                    <div className="h-64 rounded-xl bg-white" />
                </div>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f0f5f0] px-5 text-center">
                <span className="text-5xl">🔎</span>
                <h1 className="mt-4 text-xl font-bold text-gray-800">
                    পণ্য পাওয়া যায়নি
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-5 rounded-lg bg-[#ccff00] px-5 py-2.5 text-sm font-semibold text-gray-900"
                >
                    আবার চেষ্টা করুন
                </button>
                <Link href="/" className="mt-3 text-sm text-gray-600 underline">
                    সব পণ্য দেখুন
                </Link>
            </main>
        );
    }

    const isUp = product.change.dir === "up";
    const isDown = product.change.dir === "down";

    const prices = product.markets.flatMap((market) => [
        market.min,
        market.max,
    ]);

    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;
    const avgPrice = prices.length
        ? prices.reduce((sum, price) => sum + price, 0) / prices.length
        : 0;

    return (
        <main className="min-h-[70vh] bg-[#f0f5f0] px-3 py-5 sm:px-5 sm:py-8">
            <div className="mx-auto max-w-6xl space-y-4">
                <nav className="text-xs text-gray-500">
                    <Link href="/" className="hover:text-gray-900">
                        হোম
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-700">{product.categoryNameBn}</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">{product.nameBn}</span>
                </nav>

            
                <section className="flex items-center gap-3 rounded-xl border border-[#e3ebe3] bg-[#fbfcfa] p-3 sm:gap-5 sm:p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eef4ee] text-2xl sm:h-16 sm:w-16 sm:text-3xl">
                        {product.image || product.categoryIcon || "🛒"}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h1 className="text-base font-bold text-[#263329] sm:text-2xl">
                            {product.nameBn}
                        </h1>
                        <p className="mt-1 text-xs text-gray-500">
                            {product.categoryNameBn} · প্রতি {product.unit}
                        </p>
                        <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                            বাংলাদেশের বিভিন্ন বাজারের সর্বশেষ দাম
                        </p>
                    </div>

                    <div className="shrink-0 rounded-xl bg-[#eef4ee] px-3 py-3 text-center sm:px-5">
                        <p className="text-[10px] text-gray-500">আজকের বাজার দর</p>
                        <p className="mt-1 text-xl font-bold text-[#263329] sm:text-3xl">
                            {toBengaliNumber(product.today)}
                        </p>
                        <p className="text-[10px] text-gray-500">
                            টাকা / {product.unit}
                        </p>
                        <p
                            className={`mt-1 text-[10px] font-semibold ${isUp
                                    ? "text-red-600"
                                    : isDown
                                        ? "text-green-600"
                                        : "text-gray-500"
                                }`}
                        >
                            {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
                            {toBengaliNumber(product.change.pct)}%
                        </p>
                    </div>
                </section>

                
                <section className="rounded-xl border border-[#e3ebe3] bg-[#fbfcfa] p-3 sm:p-5">
                    <h2 className="text-sm font-bold text-[#263329]">
                        দামের সারসংক্ষেপ
                    </h2>

                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                        <div className="rounded-xl border border-[#e3ebe3] p-3">
                            <p className="text-[11px] text-gray-500">সর্বনিম্ন দাম</p>
                            <p className="mt-1 text-xl font-bold text-green-600">
                                {formatPrice(minPrice)}
                            </p>
                            <p className="mt-1 text-[10px] text-gray-500">
                                বাজারের সর্বনিম্ন দর
                            </p>
                        </div>

                        <div className="rounded-xl border border-[#e3ebe3] p-3">
                            <p className="text-[11px] text-gray-500">সর্বোচ্চ দাম</p>
                            <p className="mt-1 text-xl font-bold text-red-600">
                                {formatPrice(maxPrice)}
                            </p>
                            <p className="mt-1 text-[10px] text-gray-500">
                                বাজারের সর্বোচ্চ দর
                            </p>
                        </div>

                        <div className="rounded-xl border border-[#e3ebe3] p-3">
                            <p className="text-[11px] text-gray-500">গড় দাম</p>
                            <p className="mt-1 text-xl font-bold text-green-600">
                                {formatPrice(Math.round(avgPrice))}
                            </p>
                            <p className="mt-1 text-[10px] text-gray-500">
                                সব বাজারের গড় মূল্য
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-[#e3ebe3] bg-[#fbfcfa] p-3 sm:p-5">
                    <h2 className="text-sm font-bold text-[#263329]">
                        বাজারভিত্তিক আজকের দাম
                    </h2>

                    {product.markets.length === 0 ? (
                        <p className="mt-4 rounded-lg bg-[#f0f5f0] p-5 text-sm text-gray-500">
                            এই পণ্যের বাজারভিত্তিক দাম পাওয়া যায়নি।
                        </p>
                    ) : (
                        <div className="mt-3 overflow-x-auto rounded-xl border border-[#e3ebe3]">
                            <table className="w-full min-w-[520px] border-collapse text-left text-xs">
                                <thead className="bg-[#f5f8f4] text-gray-600">
                                    <tr>
                                        <th className="px-3 py-3 font-semibold sm:px-4">
                                            বাজার
                                        </th>
                                        <th className="px-3 py-3 font-semibold sm:px-4">
                                            বিভাগ
                                        </th>
                                        <th className="px-3 py-3 text-right font-semibold sm:px-4">
                                            সর্বনিম্ন
                                        </th>
                                        <th className="px-3 py-3 text-right font-semibold sm:px-4">
                                            সর্বোচ্চ
                                        </th>
                                        <th className="px-3 py-3 text-right font-semibold sm:px-4">
                                            গড়
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {product.markets.map((market, index) => (
                                        <tr
                                            key={`${market.market}-${index}`}
                                            className={
                                                index % 2 === 0
                                                    ? "border-t border-[#e3e9e2] bg-[#fbfcfa]"
                                                    : "border-t border-[#e3e9e2] bg-[#f0f4ef]"
                                            }
                                        >
                                            <td className="px-3 py-3 font-medium text-gray-800 sm:px-4">
                                                {market.market}
                                            </td>
                                            <td className="px-3 py-3 text-gray-600 sm:px-4">
                                                {market.division}
                                            </td>
                                            <td className="px-3 py-3 text-right text-gray-700 sm:px-4">
                                                {formatPrice(market.min)}
                                            </td>
                                            <td className="px-3 py-3 text-right text-gray-700 sm:px-4">
                                                {formatPrice(market.max)}
                                            </td>
                                            <td className="px-3 py-3 text-right font-medium text-gray-700 sm:px-4">
                                                {formatPrice(
                                                    Math.round((market.min + market.max) / 2)
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

            </div>
        </main>
    );
}