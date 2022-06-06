import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen p-4 flex flex-col items-center text-white">
      <img
        src="/background.jpg"
        alt=""
        className="fixed -z-50 top-0 right-0 bottom-0 left-0 w-screen h-screen object-cover pointer-events-none select-none touch-none"
      />
      <Component {...pageProps} />
      <footer>
        <span className="text-sm">
          ©Technocorner {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
}

export default MyApp;
