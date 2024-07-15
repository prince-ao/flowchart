import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-10 w-full bg-gray-800 py-2 flex flex-col justify-center items-center text-[white]">
      <div className="flex gap-4">
        <Link
          href="/about"
          className="hover:text-white px-4 py-2 text-sm md:text-md"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="hover:text-white px-4 py-2 text-sm md:text-md"
        >
          Contact
        </Link>

        <Link
          href="/resources"
          className="hover:text-white px-4 py-2 text-sm md:text-md"
        >
          Resources
        </Link>
      </div>
      <div className="text-[white] font-bold mt-2 text-xs md:text-md">
        ⚠️ THIS IS INTENDED TO BE USED ONLY AS A GUIDE
      </div>
    </footer>
  );
}
