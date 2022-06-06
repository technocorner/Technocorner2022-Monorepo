import { useEffect, useState } from "react";
import { AppProps } from "next/app";
import "../styles/globals.css";
import "../styles/nprogress.css";
import { Provider } from "react-redux";
import store from "../libs/store/store";
import { Toaster } from "react-hot-toast";
import Header from "../components/Header";
import Uploader from "../components/Uploader";
import { ModalType } from "../interfaces";
import { useRouter } from "next/router";
import NProgress from "nprogress";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [enableScroll, setEnableScroll] = useState(true);
  const [modal, setModal] = useState<ModalType>(ModalType.Disable);

  useEffect(() => {
    if (modal !== ModalType.Disable) {
      setEnableScroll(false);
    } else {
      setEnableScroll(true);
    }
  }, [modal]);

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
    <>
      {/* TailwindCSSS workaround for Toaster styling */}
      <div className="hover:bg-blue-light hover:text-white-light hover:border-blue-light" />
      <Toaster />
      <div
        className={`min-w-screen ${!enableScroll ? "overflow-y-hidden" : ""}`}
      >
        <Provider store={store}>
          {modal !== ModalType.Disable && (
            <Uploader modal={modal} setModal={setModal} />
          )}
          <div className="px-4 md:px-12 lg:px-24 py-4 md:py-6 lg:py-12">
            <Header />
            <Component {...pageProps} setModal={setModal} />
          </div>
        </Provider>
      </div>
    </>
  );
}

export default MyApp;
