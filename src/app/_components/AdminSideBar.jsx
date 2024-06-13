export default function AdminSideBar() {
  return (
    <div className="w-1/5 bg-primary text-white h-[100vh]">
      <ul>
        <a
          href="/admin/home"
          className="hover:bg-secondary flex justify-center items-center py-4"
        >
          <li className="text-lg">Home</li>
        </a>
        <a
          href="/admin/home/update"
          className="hover:bg-secondary flex justify-center items-center py-4"
        >
          <li className="text-lg">Update</li>
        </a>
      </ul>
    </div>
  );
}
