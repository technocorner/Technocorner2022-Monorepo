import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { dataGambar } from "../../data/dataGambar";
import Image from "next/image";
import arrownext from "../../public/images/Competitions/next-arrow.svg";
import arrowprev from "../../public/images/Competitions/prev-arrow.svg";

function NextArrow(props: any) {
  const { className, style, onClick } = props;
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

export default function Gallery(props: any) {
  const list = dataGambar.filter((items) => items.category == props.name);

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
        className="bg-cstmwhite overflow-x-hidden md:px-24 lg:px-36 pt-12 md:pt-16 xl:pt-20 pb-8"
      >
        <h2 className="font-mechano text-sm md:text-lg lg:text-2xl 2xl:text-3xl text-center pb-2 sm:pb-4 md:pb-6 ">
          Galeri
        </h2>
        <div className="relative">
          <Slider {...settings}>
            {list.map((items, index) => (
              <div className="w-full p-0.5 sm:p-2" key={index}>
                <div className="text-center block">
                  <Image
                    className="rounded-lg"
                    src={items.picture}
                    width={416}
                    height={234}
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
}
