export default function Legend({}) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <div className="absolute left w-[100px] lg:w-[200px] h-50 text-center  text-xs border-2 border-black !bg-white">
      <p className="font-bold lg:text-lg mt-1 lg:mt-2">LEGEND</p>
      <div className=" inline-flex items-center">
        <img
          src={basePath + "/images/arrow.png"}
          className="w-7 h-7 lg:w-10 lg:h-10 mr-2"
        />
        <p className="text-xs">pre-requisite</p>
      </div>
      <div className=" inline-flex items-center">
        <img
          src={basePath + "/images/double-arrow.jpeg"}
          className="w-7 h-3 lg:w-10 lg:h-5 mr-2"
        />
        <p className="text-xs">co-requisite</p>
      </div>
    </div>
  );
}
