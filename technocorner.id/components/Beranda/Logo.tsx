import React from "react";
import Image from "next/image";
import styles from "./Logo.module.css";
import { Link } from "react-scroll";

function Logo() {
  return (
    <div className="h-screen">
      <div className="h-full relative py-24 bg-cstmblack grid content-center px-4 md:px-24 lg:px-36">
        <div data-aos="fade-in" className="w-24 sm:w-24 lg:w-32 2xl:w-48 block m-auto text-center">
          <Image
            src="/images/Homepage/Hero.svg"
            alt="Logo"
            width={200}
            height={370}
          />
        </div>
        <div data-aos="fade-up" data-aos-delay="1000" className="grid content-center text-center">
          <h1 className="text-md md:text-2xl lg:text-4xl 2xl:text-5xl font-mechsuit text-white-default md:mb-8">
            Technocorner
          </h1>
          <p className="text-md md:text-lg lg:text-2xl 2xl:text-3xl font-mechsuit text-white-default">
            2022
          </p>
        </div>
        <div>
          <Link to="about" spy={true} smooth={true}>
            <button
              className={`absolute left-1/2 bottom-8 max-w-[10%] sm:max-w-[7%] ${styles.arrowBounce}`}
            >
              <Image
                src="/images/Homepage/vector.svg"
                alt="Arrow"
                width={85}
                height={24}
              />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
export { Logo };
