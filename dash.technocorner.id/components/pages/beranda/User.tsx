import Link from "next/link";
import { useEffect, useState } from "react";
import { getData } from "../../../lib/method";
import { toastError } from "../../../lib/toast";
import Loading from "../Loading";
import Timeline from "./Timeline";

const initData: {
  pengumuman: Array<{
    penerima?: string;
    judul?: string;
    isi?: string;
    expand?: boolean;
  }>;
  acara: Array<{ id: string; kategori: string; nama?: string }>;
  rundown: {};
} = { pengumuman: [], acara: [], rundown: {} };

export default function User() {
  const [data, setData] = useState(initData);
  const [announcementData, setAnnouncementData] = useState(initData.pengumuman);
  const [announcementPage, setAnnouncementPage] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);
  const paginate = 3;

  useEffect(() => {
    (async () => {
      const res = await getData("/dashboard/beranda");
      if (res.success) {
        setData(res.body);
        setForceUpdate((prev) => prev + 1);
      } else {
        toastError(res.body.error);
      }
    })();
  }, []);

  useEffect(() => {
    setAnnouncementData(
      data.pengumuman.slice(
        announcementPage * paginate,
        (announcementPage + 1) * paginate
      )
    );
  }, [data, announcementPage]);

  return forceUpdate === 0 ? (
    <Loading />
  ) : (
    <div className="flex-grow flex flex-col lg:flex-row gap-8 font-[GothamBook]">
      <div className="lg:flex-grow">
        <h1 className="font-[GothamBold] text-2xl">Beranda</h1>
        <div className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-r from-green-default to-green-default/70 backdrop-blur-[5px] text-white-light">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="font-[Gotham] text-xl">Pengumuman</h2>
            <div className="flex items-center">
              <span className="hidden sm:inline mr-2 font-sans">
                {announcementPage * paginate + 1 < data.pengumuman.length &&
                  (paginate ? announcementPage * paginate + 1 : 1) + "-"}
                {(announcementPage + 1) * paginate < data.pengumuman.length
                  ? (announcementPage + 1) * paginate
                  : data.pengumuman.length}{" "}
                dari {data.pengumuman.length}
              </span>
              <button
                className={`material-icons-outlined ${
                  !(announcementPage > 0) && "text-white-dark"
                }`}
                onClick={() =>
                  setAnnouncementPage((prev) => (prev > 0 ? prev - 1 : prev))
                }
              >
                navigate_before
              </button>
              <button
                className={`material-icons-outlined ${
                  !(
                    announcementPage * paginate <
                    data.pengumuman.length - paginate
                  ) && "text-white-dark"
                }`}
                onClick={() =>
                  setAnnouncementPage((prev) =>
                    prev * paginate < data.pengumuman.length - paginate
                      ? prev + 1
                      : prev
                  )
                }
              >
                navigate_next
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {announcementData && announcementData.length ? (
              announcementData.map((p, index) => (
                <button
                  className="text-left bg-green-dark/30 hover:bg-green-dark/60 p-4 rounded-xl"
                  key={index}
                  onClick={() => {
                    p.expand = !p.expand;
                    setForceUpdate((prev) => prev + 1);
                  }}
                >
                  <h3 className="font-[Gotham]">{p.judul}</h3>
                  <p className="text-sm">Untuk: {p.penerima}</p>
                  <p className={`mt-0.5 ${!p.expand && "line-clamp-2"}`}>
                    {p.isi}
                  </p>
                </button>
              ))
            ) : (
              <p>Tidak ada pengumuman</p>
            )}
          </div>
        </div>
        <div className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-r from-red-default to-red-default/70 backdrop-blur-[5px] text-white-light">
          <h2 className="mb-4 font-[Gotham] text-xl">Kegiatan yang diikuti</h2>
          {data.acara && data.acara.length ? (
            <div className="flex flex-col gap-2">
              {data.acara.map((a) => {
                let kategori = "";
                switch (a.kategori) {
                  case "iot":
                    kategori = "Internet of Things Development Competition";
                    break;
                  case "eec":
                    kategori = "Electrical Engineering Competition";
                    break;
                  case "lf":
                    kategori = "Line Follower";
                    break;
                  case "tp":
                    kategori = "Transporter";
                    break;
                  case "webinar":
                    kategori = "Webinar";
                    break;
                  case "workshop":
                    kategori = "Workshop";
                    break;
                }
                switch (a.kategori) {
                  case "iot":
                  case "eec":
                  case "lf":
                  case "tp":
                    return (
                      <Link
                        href={`/kompetisi/${a.kategori}/tim/${a.id}`}
                        key={a.id}
                      >
                        <a className="p-4 bg-red-dark/50 rounded-xl hover:bg-red-dark">
                          <h3 className="font-[Gotham]">{kategori}</h3>
                          <p>Tim: {a.nama}</p>
                        </a>
                      </Link>
                    );
                  default:
                    return (
                      <Link href={`${a.kategori}/peserta/${a.id}`} key={a.id}>
                        <a className="p-4 bg-red-dark/50 rounded-xl hover:bg-red-dark">
                          <h3 className="font-[Gotham]">{kategori}</h3>
                        </a>
                      </Link>
                    );
                }
              })}
            </div>
          ) : (
            <p>Belum ada kegiatan yang diikuti</p>
          )}
        </div>
      </div>
      <div className="flex-none w-full lg:w-[373px]">
        <Timeline rundown={data.rundown} />
      </div>
    </div>
  );
}
