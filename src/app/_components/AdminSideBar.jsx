export default function AdminSideBar() {
  return (
    <div className="w-1/5 bg-primary text-white h-[100vh]">
      <h1 className="text-3xl font-bold py-6 text-center">Admin Page</h1>
      <ul>
        <a
          href="/admin/home"
          className="hover:bg-secondary flex justify-center items-center py-4"
        >
          <li className="text-lg">Home</li>
        </a>
        <a
          href="/admin/update"
          className="hover:bg-secondary flex justify-center items-center py-4"
        >
          <li className="text-lg">Update</li>
        </a>
      </ul>
    </div>
  );
}
