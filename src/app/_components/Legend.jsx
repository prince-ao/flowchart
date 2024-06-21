export default function Legend({}) {
  return (
<div className="absolute right-4 w-[150px] h-50 text-center  text-xs border-2 border-black">
    <b>LEGEND</b>
     <div className=" inline-flex items-center">   
  <img src="/images/arrow.png" className="w-10 h-10 mr-2" />
  <p className="text-xs">pre-requisite</p>
  </div>
  <div className=" inline-flex items-center">   
  <img src="/images/double-arrow.jpeg" className="w-10 h-5 mr-2" />
  <p className="text-xs">co-requisite</p>
  </div>
</div>

  );

}