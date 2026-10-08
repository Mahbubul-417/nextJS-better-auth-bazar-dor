import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="px-4 py-5 sm:py-8">

      <div className="max-w-6xl mx-auto">

        <div className="rounded-3xl bg-[#f7faf7] border border-gray-200 px-6 py-8 sm:px-10 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-8">


          <div className="w-full md:w-3/5">


            <p className="text-sm text-gray-500">
              {new Intl.DateTimeFormat("bn-BD", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date())}
            </p>

           
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
              আজকের বাজারের দাম এক নজরে
            </h2>

          
            <p className="mt-4 text-gray-500 text-sm sm:text-base leading-7 max-w-xl">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
              বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের
              পরিবর্তন এক জায়গায়।
            </p>

           
            <Link
              href="#সব-পণ্য"
              className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-lg shadow-sm transition text-sm sm:text-base"
            >
              সব পণ্য দেখুন
            </Link>

          </div>


          <Image
            src="/images/bazar-hero.png"
            alt="বাজার দর"
            width={400}
            height={300}
            priority
          />
        </div>

      </div>

    </section>
  );
}