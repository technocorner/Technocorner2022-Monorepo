import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { postData } from "../../lib/method";
import client from "../../data/client";
import { toastError, toastLoading } from "../../lib/toast";
import { Transition } from "@headlessui/react";
import toast from "react-hot-toast";

export default function Nav({
  user,
}: {
  user: { photo: string; name: string; email: string; role: string };
}) {
  const router = useRouter();
  const [userPhoto, setUserPhoto] = useState(user.photo);
  const [nav, setNav] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const selectedNavClass =
    "relative rounded-l-full bg-white-light text-black-default before:absolute before:z-[-1] before:right-0 before:w-10 before:h-10 before:bottom-10 before:bg-transparent before:rounded-full before:shadow-[1.25rem_1.25rem_0_0_#fff] after:absolute after:z-[-1] after:right-0 after:w-10 after:h-10 after:top-10 after:bg-transparent after:rounded-full after:shadow-[1.25rem_-1.25rem_0_0_#fff]";
  const allNav = [
    "",
    "profil",
    "pengguna",
    "tautan",
    "linktree",
    "kompetisi",
    "workshop",
    "webinar",
    "bantuan",
    "kontak",
  ];

  const navmobilecss = "text-sm font-gothammedium block";
  const loginmobilecss =
    "text-sm font-bold w-full block text-white-light py-2 text-center bg-red-default rounded-lg hover:bg-red-default/75";

  useEffect(() => {
    if (router.pathname.length > 0) {
      setNav(allNav.indexOf(router.pathname.split("/")[1]));

      router.beforePopState(({ url }) => {
        setNav(allNav.indexOf(url.split("/")[1]));
        return true;
      });

      return () => router.beforePopState(() => true);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (router.pathname.length > 0) {
      setNav(allNav.indexOf(router.pathname.split("/")[1]));
    }
  }, [router.pathname]);

  async function signoutHandler() {
    const loadingToast = toastLoading();
    const res = await postData("/auth/signout", {});
    toast.dismiss(loadingToast);
    if (res.success) {
      router.replace(client.main + "/auth/signin");
    } else {
      toastError("Terjadi galat");
    }
  }

  return (
    <div className="absolute top-0">
      {/* Desktop */}
      <div className="hidden lg:block fixed z-[1] h-screen bg-gradient-to-b from-green-darker to-blue-default rounded-r-3xl text-white-light overflow-hidden">
        <div className="absolute -right-[29%] -top-[3%] w-44 h-44 rounded-full bg-green-dark transform-gpu blur-[100px]"></div>
        <div className="absolute -left-[26%] top-[18%] w-44 h-44 rounded-full bg-blue-default transform-gpu blur-[100px]"></div>
        <div className="absolute left-[15%] -bottom-[10%] w-44 h-44 rounded-full bg-green-dark transform-gpu blur-[70px]"></div>
        <div className="relative z-10 flex flex-col items-center w-[20.625rem] h-full pt-10 pb-8">
          <p className="font-['Mechsuit']">Technocorner</p>
          <div className="w-3/4 mt-10 mb-6 flex flex-col items-center">
            <img
              className="w-32 h-32 object-cover rounded-full"
              src={userPhoto ? userPhoto : user.photo}
              alt={user.name}
              referrerPolicy="no-referrer"
              onError={() => setUserPhoto(user.photo + "?" + Date.now())}
            />
            <p className="w-full mt-4 font-[Gotham] text-green-light text-lg text-center truncate">
              {user.name}
            </p>
            <p className="w-full mb-3 text-center truncate">{user.email}</p>
            <button
              className="rounded-full border border-green-light px-3 py-0.5 text-sm text-green-light"
              onClick={signoutHandler}
            >
              Keluar
            </button>
          </div>
          <nav className="self-end w-72 pb-10 leading-10 overflow-y-auto custom-scrollbar">
            <p className="pl-8">Umum</p>
            <div className={nav === 0 ? selectedNavClass : ""}>
              <Link href="/">
                <a className="w-full pl-8 flex items-center gap-2 rounded-l-full">
                  <span className="material-icons">home</span>
                  <span>Beranda</span>
                </a>
              </Link>
            </div>
            {user.role && (
              <div className={nav === 1 || nav === 2 ? selectedNavClass : ""}>
                <Link href={user.role === "admin" ? "/pengguna" : "/profil"}>
                  <a className="w-full pl-8 flex items-center gap-2 rounded-l-full">
                    <span className="material-icons">person</span>
                    <span>{user.role === "admin" ? "Pengguna" : "Profil"}</span>
                  </a>
                </Link>
              </div>
            )}
            {user.role === "admin" && (
              <div className={nav === 3 ? selectedNavClass : ""}>
                <Link href="/tautan">
                  <a className="w-full pl-8 flex items-center gap-2 rounded-l-full">
                    <span className="material-icons">link</span>
                    <span>Tautan</span>
                  </a>
                </Link>
              </div>
            )}
            {user.role === "admin" && (
              <div className={nav === 4 ? selectedNavClass : ""}>
                <Link href="/linktree">
                  <a className="w-full pl-8 flex items-center gap-2 rounded-l-full">
                    <span className="material-icons">share</span>
                    <span>LinkTree</span>
                  </a>
                </Link>
              </div>
            )}
            <p className="pl-8 mt-2">Acara</p>
            <div className={nav === 5 ? selectedNavClass : ""}>
              <Link href="/kompetisi">
                <a className="w-full pl-8 flex items-center gap-2 rounded-l-full">
                  <span className="material-icons">emoji_events</span>
                  <span>Kompetisi</span>
                </a>
              </Link>
            </div>
            <div className={nav === 6 ? selectedNavClass : ""}>
              <Link href="/workshop">
                <a className="w-full pl-8 flex items-center gap-2 rounded-l-full">
                  <span className="material-icons">engineering</span>
                  <span>Workshop</span>
                </a>
              </Link>
            </div>
            <div className={nav === 7 ? selectedNavClass : ""}>
              <Link href="/webinar">
                <a className="w-full pl-8 flex items-center gap-2 rounded-l-full">
                  <span className="material-icons">co_present</span>
                  <span>Webinar</span>
                </a>
              </Link>
            </div>
            {process.env.NODE_ENV === "development" && (
              <>
                <p className="pl-8 mt-2">Bantuan</p>
                <div className={nav === 8 ? selectedNavClass : ""}>
                  <Link href="/bantuan">
                    <a className="w-full pl-8 flex items-center gap-2 rounded-l-full">
                      <span className="material-icons">help_center</span>
                      <span>Pusat Bantuan</span>
                    </a>
                  </Link>
                </div>
                {/* <div className={nav === 9 ? selectedNavClass : ""}>
                  <Link href="/kontak">
                    <a className="w-full pl-8 flex items-center gap-2 rounded-l-full">
                      <span className="material-icons">support_agent</span>
                      <span>Kontak</span>
                    </a>
                  </Link>
                </div> */}
              </>
            )}
          </nav>
          <Link href={client.main}>
            <a className="flex items-center gap-2 mt-auto pt-4">
              <span className="material-icons">arrow_back</span>
              <span>Kembali ke halaman utama</span>
            </a>
          </Link>
        </div>
      </div>
      {/* Mobile */}
      <div className="fixed z-10 lg:hidden">
        <nav
          id="navi"
          className={`fixed bg-white-default drop-shadow-[0_6px_6px_rgba(0,0,0,0.1)] w-full z-10 px-[5%] md:px-[5%]`}
        >
          <div className="w-full">
            <div className="flex items-center w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex justify-center items-center flex-shrink-0">
                  <a href={client.main}>
                    <img
                      loading="lazy"
                      className="block h-5 w-5"
                      src="/assets/main/hero.svg"
                      alt="Hero"
                    />
                  </a>
                </div>
              </div>
              <div className="flex p-1 lg:hidden">
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
              <div className="lg:hidden" id="mobile-menu">
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
                  <Link href={user.role === "admin" ? "/pengguna" : "/profil"}>
                    <a
                      className={navmobilecss}
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      {user.role === "admin" ? "Pengguna" : "Profil"}
                    </a>
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/tautan">
                      <a
                        className={navmobilecss}
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        Tautan
                      </a>
                    </Link>
                  )}
                  {user.role === "admin" && (
                    <Link href="/linktree">
                      <a
                        className={navmobilecss}
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        LinkTree
                      </a>
                    </Link>
                  )}
                  <Link href="/kompetisi">
                    <a
                      className={navmobilecss}
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      Kompetisi
                    </a>
                  </Link>
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
                  {process.env.NODE_ENV === "development" && (
                    <>
                      <Link href="/bantuan">
                        <a
                          className={navmobilecss}
                          onClick={() => setIsOpen(!isOpen)}
                        >
                          Pusat Bantuan
                        </a>
                      </Link>
                      <Link href="/kontak">
                        <a
                          className={navmobilecss}
                          onClick={() => setIsOpen(!isOpen)}
                        >
                          Kontak
                        </a>
                      </Link>
                    </>
                  )}
                  <button
                    className={loginmobilecss}
                    onClick={() => {
                      signoutHandler();
                      setIsOpen(!isOpen);
                    }}
                  >
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </Transition>
        </nav>
      </div>
    </div>
  );
}
