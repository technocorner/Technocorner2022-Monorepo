import Image from "next/image";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { testimonialThumb } from "../../data/thumbList";

function Testimonial() {
  // Carousel
  const list = testimonialThumb;
  const renderCustomThumbs = () => {
    const thumbList = list.map((items) => (
      <picture key={items.id}>
        <source type="image/jpg" />
        <img className="rounded-full" key={items.id} src={items.logo} />
      </picture>
    ));
    return thumbList;
  };

  const containerCSS =
    "rounded-lg grid grid-cols-2 sm:grid-cols-4 text-center gap-2 sm:gap-6";
  const box =
    "h-full p-2 md:p-4 lg:p-6 m-auto bg-cstmglass shadow-lg rounded-lg w-full flex flex-col";
  const count =
    "text-3xl md:text-4xl lg:text-5xl my-1 font-gothambold text-cstmgreen row-span-2";
  const note =
    "text-2xs md:text-xs xl:text-base 2xl:text-lg text-gothambook text-cstmblack";

  return (
    <>
      <style jsx global>{`
        li.thumb.selected {
          border: 3px solid #ef476f !important;
        }
        li.thumb {
          border-radius: 9999px;
        }
        li.thumb:hover {
          border: 3px solid #ef476f !important;
        }
      `}</style>
      <div className="bg-cstmwhite py-20 px-4 md:px-24 lg:px-36 space-y-20">
        <div className="content-center">
          <div
            data-aos="fade-up"
            className="h-full block content-center md:grid"
          >
            <div className="text-sm md:text-base lg:text-lg xl:text-xl font-mechano text-center ">
              Testimoni Mengenai Technocorner 2021
            </div>
            <Carousel
              className={"text-center w-full block"}
              showThumbs={true}
              showIndicators={false}
              showStatus={false}
              infiniteLoop={true}
              autoPlay={false}
              showArrows={true}
              renderThumbs={renderCustomThumbs}
            >
              {list.map((item) => (
                <div
                  key={item.id}
                  className="content-start lg:content-center h-full md:flex"
                >
                  <div className="block m-auto">
                    <Image
                      className="rounded-full"
                      src={item.logo}
                      alt="Profil Testimoni"
                      width={150}
                      height={150}
                    />
                  </div>
                  <div className="md:w-3/4 content-center grid text-justify">
                    <p className="text-2xs md:text-xs xl:text-base 2xl:text-lg font-gothambook text-justify my-1 md:my-3 xl:my-6">
                      {item.testimoni}
                    </p>
                    <p className="text-2xs xl:text-sm 2xl:text-base">
                      {item.tokoh}
                    </p>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
        <div data-aos="fade-up" className="w-10/12 m-auto">
          <div className="py-4 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-center font-mechano">
            <p className="leading-10">Statistik technocorner 2020-2021</p>
          </div>
          <div className={containerCSS}>
            <div className={box}>
              <p className={count}>887</p>
              <p className={`${note} font-bold`}>Peserta</p>
              <p className={note}>Workshop dan Webinar</p>
            </div>
            <div className={box}>
              <p className={count}>80</p>
              <p className={`${note} font-bold`}>Tim</p>
              <p className={note}>EEC</p>
            </div>
            <div className={box}>
              <p className={count}>76</p>
              <p className={`${note} font-bold`}>Tim</p>
              <p className={note}>IoT</p>
            </div>
            <div className={box}>
              <p className={count}>307</p>
              <p className={`${note} font-bold`}>Tim</p>
              <p className={note}>LF dan TP</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { Testimonial };
