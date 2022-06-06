import { useRouter } from "next/router";
import { useAppSelector, useAppDispatch } from "../libs/store/storeHooks";
import { reset, selectAuth, set } from "../libs/store/auth";
import { useEffect, useState } from "react";
import { getData, postData } from "../libs/fetch";
import statusCode from "../libs/statusCode";
import { toastError } from "../libs/toast";

export default function Header() {
  const router = useRouter();
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const [isShow, setIsShow] = useState(true);

  useEffect(() => {
    if (router.isReady && (!auth.userName || !auth.teamName)) {
      (async () => {
        const res = await getData("/auth/check-signin");

        if (res.status === statusCode.OK && res.json) {
          if (res.json.teamName && res.json.userName && res.json.role) {
            dispatch(set(res.json));
            return;
          }
        }

        if (router.pathname !== "/signin") {
          router.replace("/signin");
        }
      })();
    }
    if (router.pathname === "/signin") {
      setIsShow(false);
    } else {
      setIsShow(true);
    }
  }, [router.isReady, router.pathname]);

  async function handleSignOut() {
    const res = await postData("/auth/signout", {});
    if (res.status === statusCode.OK || res.json) {
      dispatch(reset());
      router.replace("/signin");
    } else {
      toastError("Galat saat menghapus sesi");
    }
  }

  return (
    <div className={`${isShow ? "block" : "hidden"} mb-10 flex items-center`}>
      {/* <img
            className=" w-24 h-24 object-cover rounded-full outline-2 mr-3"
            src="/images/Homepage/testimoni/pakhanung.webp"
            alt={user.name}
            referrerPolicy="no-referrer"
            onError={() => setUserPhoto(user.photo + "?" + Date.now())}
          /> */}
      <div className="flex flex-col w-full items-cener justify-start">
        <div className="flex gap-x-6 items-center justify-between">
          <p className="w-full text-green-default text-lg text-left truncate">
            {auth.userName ? auth.userName : "Memuat..."}
          </p>
          <button
            onClick={handleSignOut}
            type="button"
            className="bg-red-default rounded-lg px-4 py-1.5 text-white-default"
          >
            Keluar
          </button>
        </div>
        <p className="w-full mb-3 truncate">
          {auth.teamName ? auth.teamName : "Memuat..."}
        </p>
      </div>
    </div>
  );
}
