export default function Legend({}) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <div className="absolute left w-[200px] h-50 text-center  text-xs border-2 border-black !bg-white">
      <b>LEGEND</b>
      <div className=" inline-flex items-center">
        <img src={basePath + "/images/arrow.png"} className="w-10 h-10 mr-2" />
        <p className="text-xs">pre-requisite</p>
      </div>
      <div className=" inline-flex items-center">
        <img
          src={basePath + "/images/double-arrow.jpeg"}
          className="w-10 h-5 mr-2"
        />
        <p className="text-xs">co-requisite</p>
      </div>
    </div>
  );
}
