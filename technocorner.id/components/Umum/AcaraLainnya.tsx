import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { dataAcara } from "../../data/dataAcara";
import Image from "next/image";
import arrownext from "../../public/images/Competitions/next-arrow.svg";
import arrowprev from "../../public/images/Competitions/prev-arrow.svg";

function NextArrow(props: any) {
  const { style, onClick } = props;
  return (
    <div
      className="absolute -right-0 h-full bottom-0  translate-x-full grid content-center cursor-pointer"
      style={{
        ...style,
        display: "grid",
      }}
      onClick={onClick}
    >
      <div className="hidden md:block align-middle h-full">
        <Image src={arrownext} height={50} width={50} />
      </div>
    </div>
  );
}

function PrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute -left-0 h-full -translate-x-full grid content-center cursor-pointer"
      style={{
        ...style,
        display: "grid",
      }}
      onClick={onClick}
    >
      <div className="block align-middle h-full">
        <Image src={arrowprev} height={50} width={50} />
      </div>
    </div>
  );
}

export default function AcaraLainnya(props: { name: string }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplayspeed: 3000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          className: "center",
          centerMode: true,
          centerPadding: "20px",
          autoplay: false,
        },
      },
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />,
        },
      },
    ],
  };

  return (
    <>
      <style jsx global>{`
        .slick-arrow.slick-next {
          display: none !important;
        }
        @media screen and (max-width: 768px) {
          .slick-arrow.slick-next {
            display: none !important;
          }
        }
      `}</style>
      <div
        data-aos="fade-up"
        className="overflow-x-hidden bg-cstmwhite md:px-28 lg:px-40 py-12 md:py-16 xl:py-20"
      >
        <h2 className="font-mechano text-sm md:text-lg lg:text-2xl 2xl:text-3xl text-center pb-2 sm:pb-4 md:pb-6">
          Acara Lainnya
        </h2>
        <Slider {...settings}>
          {dataAcara.map(
            (item) =>
              item.id !== props.name && (
                <a
                  className="h-full w-11/12 my-6 transform transition-transform transition-300 hover:scale-105"
                  key={item.id}
                  style={{ aspectRatio: "1/1" }}
                  href={
                    item.name === "workshop" || item.name === "webinar"
                      ? `/${item.name}`
                      : `/kompetisi/${item.name}`
                  }
                >
                  <div className="h-full rounded-xl shadow-lg grid gap-3 mx-4 p-2 md:p-3 bg-cstmwhite">
                    <div
                      className="block m-auto w-6/12 lg:w-8/12"
                      style={{ aspectRatio: "1/1" }}
                    >
                      <img loading="lazy" src={item.logo} alt={item.title} />
                    </div>
                    <p className="h-16 flex justify-center items-center text-center font-mechano text-sm md:text-base">
                      {item.title}
                    </p>
                  </div>
                </a>
              )
          )}
        </Slider>
      </div>
    </>
  );
}
