import React, { useEffect, useState, useRef } from "react";
import useMobile from "./hooks/useMobile";
import { Transition, Menu } from "@headlessui/react";
import Link from "next/link";
import client from "../../data/client";

function Navbar({ loggedIn, url }) {
  const pageSelect = {
    beranda: 1,
    kompetisi: 2,
    workshop: 3,
    webinar: 4,
  };
  const navRef = {
    beranda: useRef(),
    kompetisi: useRef(),
    workshop: useRef(),
    webinar: useRef(),
  };
  const [page, setPage] = useState(0);

  function focusNav(nav) {
    Object.keys(navRef).forEach((n) => {
      if (n === nav) {
        navRef[n].current.focus();
      } else {
        navRef[n].current.blur();
      }
    });
  }

  useEffect(() => {
    if (
      url.includes("iot") ||
      url.includes("eec") ||
      url.includes("linefollower") ||
      url.includes("transporter")
    ) {
      setPage(pageSelect.kompetisi);
      focusNav("kompetisi");
    } else if (url.includes("workshop")) {
      setPage(pageSelect.workshop);
      focusNav("workshop");
    } else if (url.includes("webinar")) {
      setPage(pageSelect.webinar);
      focusNav("webinar");
    } else {
      setPage(pageSelect.beranda);
      focusNav("beranda");
    }
  }, [url]);

  const [isOpen, setIsOpen] = useState(false);
  const [scroll, setScroll] = useState(false);

  const isMobile = useMobile();

  const navcss =
    "right-0 cursor-pointer leading-loose px-3 py-2.5 text-md outline-none after:block after:bg-cstmgreen after:w-full after:h-0.5 after:top-1 after:content-[''] after:scale-0 after:duration-500";
  const selectedcss = "after:scale-100";
  const logincss =
    " px-2 leading-loose bg-cstmgreen text-cstmwhite rounded-lg hover:bg-cstmgreen/75";
  const navmobilecss = "text-sm font-gothammedium block";
  const loginmobilecss =
    "text-sm font-bold w-full block text-cstmwhite py-2 text-center bg-cstmgreen rounded-lg hover:bg-cstmgreen/75";

  const getBgColor = () => {
    if (url == "/") {
      if (scroll) {
        return "bg-cstmwhite";
      } else {
        return isMobile ? "bg-cstmwhite" : "bg-cstmblack/60";
      }
    } else {
      return "bg-cstmwhite";
    }
  };

  const getTxtColor = () => {
    if (url == "/") {
      if (scroll) {
        return "text-cstmblack/75 hover:text-cstmblack focus:text-cstmblack";
      } else {
        return isMobile
          ? "text-cstmblack/75 hover:text-cstmblack focus:text-cstmblack"
          : "text-cstmwhite/75 hover:text-cstmwhite focus:text-cstmwhite";
      }
    } else {
      return "text-cstmblack/75 hover:text-cstmblack focus:text-cstmblack";
    }
  };

  const bgColor = getBgColor();
  const txtColor = getTxtColor();

  const changeScroll = () => {
    window.scrollY >= window.innerHeight ? setScroll(true) : setScroll(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", changeScroll);
  }, []);

  return !url ? (
    <></>
  ) : (
    <div className="">
      <nav
        id="navi"
        className={`fixed transition duration-300 ${bgColor} drop-shadow-[0_6px_6px_rgba(0,0,0,0.1)] w-full z-10 px-[5%] md:px-[5%]`}
      >
        <div className="w-full">
          <div className="flex items-center w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex justify-center items-center flex-shrink-0">
                {(url !== "/" || scroll || isMobile) && (
                  <img
                    loading="lazy"
                    className="block h-5 w-5 sm:h-8 sm:w-8"
                    src="/images/Homepage/Hero.svg"
                    alt="Hero"
                  />
                )}
              </div>
              <div className="hidden md:flex">
                <div className="flex gap-4 items-center">
                  <Link href="/">
                    <a
                      className={`${navcss} ${txtColor} ${
                        page === pageSelect.beranda && selectedcss
                      }`}
                      ref={navRef.beranda}
                    >
                      Beranda
                    </a>
                  </Link>
                  <div>
                    <Menu>
                      <Menu.Button
                        className={`${navcss} ${txtColor} ${
                          page === pageSelect.kompetisi && selectedcss
                        }`}
                        ref={navRef.kompetisi}
                      >
                        Kompetisi
                      </Menu.Button>
                      {/* Use the Transition component. */}
                      <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                        className="relative"
                      >
                        <Menu.Items
                          as="ul"
                          className={`
                             ${txtColor} ${bgColor} hover:font-normal focus:font-normal absolute right-0 rounded-b-md md:pb-3 right-0 cursor-pointer leading-loose px-3 py-2.5 text-md`}
                        >
                          <Menu.Item as="li" className="w-full">
                            {({ active }) => (
                              <Link href="/kompetisi/iot">
                                <a
                                  className={`w-full whitespace-nowrap	${
                                    active && "hover:text-cstmgreen"
                                  }`}
                                >
                                  IoT Development
                                </a>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item as="li" className="w-full">
                            {({ active }) => (
                              <Link href="/kompetisi/eec">
                                <a
                                  className={`w-full whitespace-nowrap	${
                                    active && "hover:text-cstmgreen"
                                  }`}
                                >
                                  EEC
                                </a>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item as="li" className="w-full">
                            {({ active }) => (
                              <Link href="/kompetisi/transporter">
                                <a
                                  className={`w-full whitespace-nowrap	${
                                    active && "hover:text-cstmgreen"
                                  }`}
                                >
                                  Transporter
                                </a>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item as="li" className="w-full">
                            {({ active }) => (
                              <Link href="/kompetisi/linefollower">
                                <a
                                  className={`w-full whitespace-nowrap	${
                                    active && "hover:text-cstmgreen"
                                  }`}
                                >
                                  Line Follower
                                </a>
                              </Link>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  <Link href="/workshop">
                    <a
                      className={`${navcss} ${txtColor} ${
                        page === pageSelect.workshop && selectedcss
                      }`}
                      ref={navRef.workshop}
                    >
                      Workshop
                    </a>
                  </Link>
                  <Link href="/webinar">
                    <a
                      className={`${navcss} ${txtColor} ${
                        page === pageSelect.webinar && selectedcss
                      }`}
                      ref={navRef.webinar}
                    >
                      Webinar
                    </a>
                  </Link>
                  <Link href={loggedIn ? client.dash : "/auth/signin"}>
                    <a className={`${logincss} text-cstmwhite`}>
                      {loggedIn ? "Dasbor" : "Masuk"}
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex p-1 md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-0.5 rounded-md text-white focus:outline-none active:ring-2 active:ring-offset-2 active:ring-offset-blue-800 active:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <Transition
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {(ref) => (
            <div className="md:hidden" id="mobile-menu">
              <div
                ref={ref}
                className="bg-white rounded-lg pt-2 pb-3 space-y-4 sm:px-3"
              >
                <Link href="/">
                  <a
                    className={navmobilecss}
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    Beranda
                  </a>
                </Link>
                <Menu>
                  <Menu.Button className={navmobilecss}>Kompetisi</Menu.Button>
                  {/* Use the Transition component. */}
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                    className="relative"
                  >
                    <Menu.Items
                      as="ul"
                      className={`${navmobilecss} ml-[2%] space-y-[2%]`}
                    >
                      <Menu.Item as="li">
                        {({ active }) => (
                          <Link href="/kompetisi/iot">
                            <a
                              onClick={() => setIsOpen(!isOpen)}
                              className={`${active && "hover:text-cstmgreen"}`}
                            >
                              IoT Development
                            </a>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item as="li">
                        {({ active }) => (
                          <Link href="/kompetisi/eec">
                            <a
                              onClick={() => setIsOpen(!isOpen)}
                              className={`${active && "hover:text-cstmgreen"}`}
                            >
                              EEC
                            </a>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item as="li">
                        {({ active }) => (
                          <Link href="/kompetisi/transporter">
                            <a
                              onClick={() => setIsOpen(!isOpen)}
                              className={`${active && "hover:text-cstmgreen"}`}
                            >
                              Transporter
                            </a>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item as="li">
                        {({ active }) => (
                          <Link href="/kompetisi/linefollower">
                            <a
                              onClick={() => setIsOpen(!isOpen)}
                              className={`${active && "hover:text-cstmgreen"}`}
                            >
                              Line Follower
                            </a>
                          </Link>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
                <Link href="/workshop">
                  <a
                    className={navmobilecss}
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    Workshop
                  </a>
                </Link>
                <Link href="/webinar">
                  <a
                    className={navmobilecss}
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    Webinar
                  </a>
                </Link>
                <Link href={loggedIn ? client.dash : "/auth/signin"}>
                  <a
                    className={loginmobilecss}
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {loggedIn ? "Dasbor" : "Masuk"}
                  </a>
                </Link>
              </div>
            </div>
          )}
        </Transition>
      </nav>
    </div>
  );
}

export { Navbar };
