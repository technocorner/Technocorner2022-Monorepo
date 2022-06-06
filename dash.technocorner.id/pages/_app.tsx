import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NProgress from "nprogress";
import { Toaster } from "react-hot-toast";
import { getData, postData } from "../lib/method";
import Nav from "../components/main/Nav";
import SafeArea from "../components/main/SafeArea";
import client from "../data/client";
import "../styles/globals.css";
import "../styles/nprogress.css";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [user, setUser] = useState({
    photo: "",
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    (async () => {
      const res = await getData("/dashboard/info");
      if (res.success) {
        setUser({
          photo: res.body.photo,
          name: res.body.name,
          email: res.body.email,
          role: res.body.role,
        });
      } else {
        const res = await postData("/auth/signout", {});
        if (!res.succes) {
          document.cookie =
            "session.sig=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
          document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        }
        location.replace(`${client.main}/auth/signin`);
      }
    })();
  }, []);

  useEffect(() => {
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
  }, [router]);

  return (
    <div className="text-sm sm:text-base">
      {/* TailwindCSSS workaround for Toaster styling */}
      <div className="hover:bg-blue-light hover:text-white-light hover:border-blue-light" />
      <Toaster />
      <Nav user={user} />
      <SafeArea>
        <Component role={user.role} {...pageProps} />
      </SafeArea>
    </div>
  );
}

export default MyApp;
