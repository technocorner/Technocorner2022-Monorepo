import React from "react";
import Image from "next/image";
import { useState } from "react";
export default function TourLab() {
  const [lab, setLab] = useState({
    labNumber: 1,
    labUrl: "https://my.matterport.com/show/?m=e4KiaiYHDdh",
  });
  const changeLab = (index: number) => {
    if (index == 1) {
      setLab({
        ...lab,
        labNumber: 1,
        labUrl: "https://my.matterport.com/show/?m=e4KiaiYHDdh",
      });
    } else if (index == 2) {
      setLab({
        ...lab,
        labNumber: 2,
        labUrl: "https://my.matterport.com/show/?m=raF2HYRTGw5",
      });
    } else if (index == 3) {
      setLab({
        ...lab,
        labNumber: 3,
        labUrl: "https://my.matterport.com/show/?m=o3beoWJe9Hv",
      });
    } else if (index == 4) {
      setLab({
        ...lab,
        labNumber: 4,
        labUrl: "https://my.matterport.com/show/?m=52LWW5kK64w",
      });
    } else if (index == 5) {
      setLab({
        ...lab,
        labNumber: 5,
        labUrl: "https://my.matterport.com/show/?m=wHVg2fYDdtG",
      });
    }
  };
  const labTitleCSS =
    "after:mt-3 after:block after:bg-green-default after:w-full after:h-0.5 after:top-1 after:content-[''] after:duration-500";
  return (
    <>
      <div className="hidden md:grid content-center mt-16 bg-gradient-to-b from-blue-dark to-green-darker min-h-screen max-h-screen">
        <div className="h-fit grid justify-items-center">
          <iframe
            className="duration-1000 ease-in-out md:w-[80vw] lg:w-[70vw]"
            style={{ aspectRatio: "853/420" }}
            src={lab.labUrl}
            frameBorder="0"
            allowFullScreen
            allow="xr-spatial-tracking"
          ></iframe>
          <div className="cursor-pointer rounded-b-lg md:w-[80vw] lg:w-[70vw] px-4 pt-4 pb-1 md:text-2xs 2xl:text-xs bg-white-default grid grid-cols-5 gap-3 text-center">
            <div
              className={
                lab.labNumber == 1
                  ? labTitleCSS + " font-gothambold after:scale-100"
                  : labTitleCSS +
                    " hover:font-gothammedium font-gothambook after:scale-0 "
              }
              onClick={() => changeLab(1)}
            >
              Lab. Informatika dan Komputer
            </div>
            <div
              className={
                lab.labNumber == 2
                  ? labTitleCSS + " font-gothambold after:scale-100"
                  : labTitleCSS +
                    " hover:font-gothammedium font-gothambook after:scale-0 "
              }
              onClick={() => changeLab(2)}
            >
              Lab. Digital Mikroprosesor
            </div>
            <div
              className={
                lab.labNumber == 3
                  ? labTitleCSS + " font-gothambold after:scale-100"
                  : labTitleCSS +
                    " hover:font-gothammedium font-gothambook after:scale-0 "
              }
              onClick={() => changeLab(3)}
            >
              Lab. Sistem Frekuensi Tinggi
            </div>
            <div
              className={
                lab.labNumber == 4
                  ? labTitleCSS + " font-gothambold after:scale-100"
                  : labTitleCSS +
                    " hover:font-gothammedium font-gothambook after:scale-0 "
              }
              onClick={() => changeLab(4)}
            >
              Lab. Jaringan Komputer
            </div>
            <div
              className={
                lab.labNumber == 5
                  ? labTitleCSS + " font-gothambold after:scale-100"
                  : labTitleCSS +
                    " hover:font-gothammedium font-gothambook after:scale-0 "
              }
              onClick={() => changeLab(5)}
            >
              Lab. Elektronika Dasar
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
