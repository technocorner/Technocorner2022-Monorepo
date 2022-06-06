import "../styles/globals.css";
import "../styles/nprogress.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NProgress from "nprogress";
import { Toaster } from "react-hot-toast";
import { SessionType } from "../interface/interface";
import InitLoading from "../components/InitLoading";
import { getData, postData } from "../lib/fetch";
import statusCode from "../lib/statusCode";
import { toastError } from "../lib/toast";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [initLoading, setInitLoading] = useState(true);
  const [session, setSession] = useState<SessionType>();

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        const res = await getData("/auth/check-signin");

        if (
          res.status === statusCode.OK &&
          res.json &&
          res.json.teamName &&
          res.json.userName &&
          res.json.role
        ) {
          if (router.pathname === "/signin") {
            router.replace("/");
          }

          setSession(res.json);
        } else if (router.pathname !== "/signin") {
          router.replace("/signin");
        }

        setInitLoading(false);
      })();
    }
  }, [router.isReady]);

  useEffect(() => {
    function handleStart() {
      NProgress.start();
    }
    function handleStop() {
      NProgress.done();
    }

    if (router) {
      NProgress.configure({ showSpinner: false });
      router.events.on("routeChangeStart", handleStart);
      router.events.on("routeChangeComplete", handleStop);
      router.events.on("routeChangeError", handleStop);

      return () => {
        router.events.off("routeChangeStart", handleStart);
        router.events.off("routeChangeComplete", handleStop);
        router.events.off("routeChangeError", handleStop);
      };
    }
  }, [router]);

  async function signIn({
    teamId,
    userEmail,
  }: {
    teamId: string;
    userEmail: string;
  }) {
    const res = await postData("/auth/signin", { teamId, userEmail });

    if (
      res.status === statusCode.OK &&
      res.json &&
      res.json.teamId &&
      res.json.teamName &&
      res.json.userId &&
      res.json.userName
    ) {
      setSession(res.json);
      router.replace("/");
    } else {
      toastError(
        res.json && res.json.userId === undefined ? res.json : "Terjadi galat"
      );
    }
  }

  async function signOut() {
    const res = await postData("/auth/signout", {});
    if (res.status === statusCode.OK || res.json) {
      setSession(undefined);
      router.replace("/signin");
    } else {
      toastError("Galat saat menghapus sesi");
    }
  }

  function disableRightClick(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    event.preventDefault();
  }

  return (
    <div onContextMenu={disableRightClick} className="select-none touch-none">
      <Toaster />
      {initLoading ? (
        <InitLoading />
      ) : (
        <Component
          {...pageProps}
          session={session}
          signIn={signIn}
          signOut={signOut}
        />
      )}
    </div>
  );
}

export default MyApp;
