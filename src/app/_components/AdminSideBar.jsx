import Link from "next/link";

export default function AdminSideBar() {
  return (
    <div className="w-1/5 bg-primary text-white min-h-[100vh]">
      <h1 className="text-3xl font-bold py-6 text-center">Admin Page</h1>
      <ul>
        <Link
          href="/admin/home"
          className="hover:bg-secondary flex justify-center items-center py-4"
        >
          <li className="text-lg">Home</li>
        </Link>
        <Link
          href="/admin/update"
          className="hover:bg-secondary flex justify-center items-center py-4"
        >
          <li className="text-lg">Update</li>
        </Link>
      </ul>
    </div>
  );
}
