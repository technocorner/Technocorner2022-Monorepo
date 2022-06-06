import React from "react";
import Image from "next/image";
import Link from "next/link";

function Footer() {
  return (
    <>
      <div className="relative z-10 bg-cstmgray px-4 md:px-24 lg:px-32 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
          <div className="sm:w-6/12">
            <p className="font-gothambold text-sm xl:text-lg mb-3">
              Semua acara Technocorner
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 font-gothambook text-xs lg:text-sm xl:text-base">
              <div>
                <p className="font-bold mb-0.5">Kompetisi</p>
                <Link href="/kompetisi/linefollower">
                  <a>
                    <p>Line Follower</p>
                  </a>
                </Link>
                <Link href="/kompetisi/transporter">
                  <a>
                    <p>Transporter</p>
                  </a>
                </Link>
                <Link href="/kompetisi/iot">
                  <a>
                    <p>IoT Development</p>
                  </a>
                </Link>
                <Link href="/kompetisi/eec">
                  <a>
                    <p>Electrical Engineering</p>
                  </a>
                </Link>
              </div>
              <div>
                <p className="font-bold mb-0.5">Webinar</p>
                <Link href="/webinar">
                  <a>
                    <p>Webinar Teknologi</p>
                  </a>
                </Link>
              </div>
              <div>
                <p className="font-bold mb-0.5">Workshop</p>
                <Link href="/workshop">
                  <a>
                    <p>Workshop Robotika</p>
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col gap-2">
            <div className="flex gap-2 items-center mx-auto">
              <img
                className="h-10 object-contain"
                loading="lazy"
                src="/images/Homepage/Hero.svg"
              />
              <div className="font-mechsuit text-sm sm:text-xs md:text-sm xl:text-base 2xl:text-lg">
                Technocorner
              </div>
            </div>
            <div className="w-full flex flex-wrap justify-between">
              <a
                href="https://www.tiktok.com/@technocornerugm"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Image src="/images/Layout/Tiktok.svg" width={25} height={25} />
              </a>
              <a
                href="https://www.instagram.com/technocornerugm/"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Image
                  src="/images/Layout/Instagram.svg"
                  width={25}
                  height={25}
                />
              </a>
              <a
                href="https://www.linkedin.com/company/technocorner-ugm-2021/"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Image
                  src="/images/Layout/Linkedin.svg"
                  width={25}
                  height={25}
                />
              </a>
              <a
                href="https://www.youtube.com/c/Technocorner"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Image
                  src="/images/Layout/Youtube.svg"
                  width={25}
                  height={25}
                />
              </a>
              <a
                href="https://twitter.com/technocornerugm"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Image
                  src="/images/Layout/Twitter.svg"
                  width={25}
                  height={25}
                />
              </a>
              <a
                href="https://www.facebook.com/TechnocornerUGM"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Image
                  src="/images/Layout/Facebook.svg"
                  width={25}
                  height={25}
                />
              </a>
              <a
                href="http://line.me/ti/p/@kdo2899c"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Image src="/images/Layout/Line.svg" width={25} height={25} />
              </a>
            </div>
          </div>
        </div>
        <div className="font-gothambook text-center text-xs sm:text-sm mt-8 sm:mt-0 sm:text-right">
          ©Technocorner 2022
        </div>
      </div>
    </>
  );
}

export { Footer };
