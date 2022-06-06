import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import NProgress from "nprogress";
import { getData } from "../libs/method";
import { Navbar } from "../components/Layout";
import "../styles/globals.css";
import "../styles/nprogress.css";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getData("/auth/check-signin");
      if (res.success && res.body) {
        setLoggedIn(true);
      }
    })();
  }, []);

  useEffect(() => {
    setUrl(router.pathname);
    if (
      !router.pathname.includes("/auth") &&
      !router.pathname.includes("/link")
    ) {
      setShowNav(true);
    } else {
      setShowNav(false);
    }

    NProgress.configure({ showSpinner: false });

    function handleStart() {
      NProgress.start();
    }
    function handleStop() {
      NProgress.done();
    }

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router.isReady, router.pathname]);

  return (
    <>
      <Toaster />
      <div className="overflow-x-hidden bg-cstmwhite">
        {showNav && <Navbar loggedIn={loggedIn} url={url} />}
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
