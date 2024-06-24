export default function Footer() {
  return (
    <footer class="mt-10 w-full bg-gray-800 py-2 flex flex-col justify-center items-center text-[white]">
      <div className="flex gap-4">
        <a href="/about" className="hover:text-white px-4 py-2">
          About
        </a>
        <a href="/contact" className="hover:text-white px-4 py-2">
          Contact
        </a>

        <a href="/resources" className="hover:text-white px-4 py-2">
          Resources
        </a>
      </div>
      <div className="text-[white] font-bold mt-2">
        ⚠️ THIS IS INTENDED TO BE USED ONLY AS A GUIDE
      </div>
    </footer>
  );
}
