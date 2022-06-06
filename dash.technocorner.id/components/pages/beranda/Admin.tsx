import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteData, getData, postData } from "../../../lib/method";
import randomId from "../../../lib/randomId";
import { toastError, toastLoading, toastSuccess } from "../../../lib/toast";
import Loading from "../Loading";
import Timeline from "./Timeline";
import { events } from "../../../data/events";

const initData: {
  pengumuman: Array<{
    id?: string;
    penerima?: string;
    judul?: string;
    isi?: string;
    expand?: boolean;
  }>;
  statAcara: {
    iot: { total: number; verifikasi: number };
    eec: { total: number; verifikasi: number };
    lf: { total: number; verifikasi: number };
    tp: { total: number; verifikasi: number };
    webinar: { total: number; verifikasi: number };
    workshop: { total: number; verifikasi: number };
  };
  statTanya: {
    iot: { total: number; terjawab: number; belumTerjawab: number };
    eec: { total: number; terjawab: number; belumTerjawab: number };
    lf: { total: number; terjawab: number; belumTerjawab: number };
    tp: { total: number; terjawab: number; belumTerjawab: number };
    webinar: { total: number; terjawab: number; belumTerjawab: number };
    workshop: { total: number; terjawab: number; belumTerjawab: number };
  };
  rundown: {};
} = {
  pengumuman: [],
  statAcara: {
    iot: { total: 0, verifikasi: 0 },
    eec: { total: 0, verifikasi: 0 },
    lf: { total: 0, verifikasi: 0 },
    tp: { total: 0, verifikasi: 0 },
    webinar: { total: 0, verifikasi: 0 },
    workshop: { total: 0, verifikasi: 0 },
  },
  statTanya: {
    iot: { total: 0, terjawab: 0, belumTerjawab: 0 },
    eec: { total: 0, terjawab: 0, belumTerjawab: 0 },
    lf: { total: 0, terjawab: 0, belumTerjawab: 0 },
    tp: { total: 0, terjawab: 0, belumTerjawab: 0 },
    webinar: { total: 0, terjawab: 0, belumTerjawab: 0 },
    workshop: { total: 0, terjawab: 0, belumTerjawab: 0 },
  },
  rundown: {},
};

export default function Admin() {
  const [data, setData] = useState(initData);
  const [announcementData, setAnnouncementData] = useState(initData.pengumuman);
  const [announcementPage, setAnnouncementPage] = useState(0);
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [announceTo, setAnnounceTo] = useState("acara");
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

  async function submitAnnounceHandler(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    const loadingToast = toastLoading();
    const target = event.target as typeof event.target & {
      tujuan: { value: string };
      judul: { value: string };
      isi: { value: string };
    };

    const id = randomId(32);
    const tipePenerima =
      announceTo === "semua pengguna" ? "pengguna" : announceTo;
    const tujuan = target.tujuan ? target.tujuan.value.trim() : "0semua";
    const judul = target.judul.value.trim();
    const isi = target.isi.value.trim();

    const res = await postData("/dashboard/beranda/pengumuman", {
      id,
      tipePenerima,
      tujuan,
      judul,
      isi,
    });

    toast.dismiss(loadingToast);
    if (res.success) {
      setData((prevData) => {
        const pengumuman = [...prevData.pengumuman];
        pengumuman.unshift({
          id,
          penerima: tujuan === "0semua" ? "Semua peserta" : tujuan,
          judul,
          isi,
        });
        return { ...prevData, pengumuman };
      });
      setShowCreateAnnouncement(false);
      toastSuccess("Pengumuman berhasil dibuat");
    } else {
      toastError("Gagal membuat pengumuman");
    }
  }
  async function deleteAnnouncement(penerima: string, id: string) {
    const loadingToast = toastLoading();

    let tipePenerima = "pengguna";
    if (events.findIndex((e) => e.name === penerima) >= 0) {
      tipePenerima = "acara";
    }

    const res = await deleteData("/dashboard/beranda/pengumuman", {
      tipePenerima,
      penerima:
        penerima === "Semua peserta"
          ? "0semua"
          : events.find((e) => e.name === penerima)?.id,
      id,
    });

    toast.dismiss(loadingToast);
    if (res.success) {
      setData((prevData) => {
        const pengumuman = prevData.pengumuman.filter(
          (p) => p.penerima !== penerima || p.id !== id
        );
        return { ...prevData, pengumuman };
      });
      toastSuccess("Pengumuman berhasil dihapus");
    } else {
      toastError("Gagal menghapus pengumuman");
    }
  }

  return forceUpdate === 0 ? (
    <Loading />
  ) : (
    <div className="flex-grow flex flex-col xl:flex-row gap-8 font-[GothamBook]">
      <div className="xl:flex-grow">
        <h1 className="font-[GothamBold] text-2xl">Beranda</h1>
        <div className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-r from-green-default to-green-default/70 backdrop-blur-[5px] text-white-light">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex gap-3">
              <h2 className="font-[Gotham] text-xl">Pengumuman</h2>
              <button
                className="hidden sm:block rounded-full px-3 py-0.5 border border-white-light font-sans text-sm"
                type="button"
                onClick={() => setShowCreateAnnouncement((prev) => !prev)}
              >
                {showCreateAnnouncement ? "Tutup" : "Buat"}
              </button>
            </div>
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
            {showCreateAnnouncement ? (
              <form className="font-sans" onSubmit={submitAnnounceHandler}>
                <div className="px-2 py-1.5 bg-white-light rounded-md">
                  <div className="flex items-center gap-2">
                    <label className="block px-1.5 text-sm text-black-default/75">
                      Penerima
                    </label>
                    {["Acara", "Pengguna", "Semua Pengguna"].map((t) => (
                      <button
                        className={`rounded-full px-3 py-0.5 border border-green-default text-sm ${
                          t.toLowerCase() === announceTo
                            ? "bg-green-default text-white-default"
                            : "text-green-default"
                        }`}
                        key={t}
                        type="button"
                        onClick={() => setAnnounceTo(t.toLowerCase())}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {announceTo === "acara" && (
                    <select
                      className="mt-2 text-black-default mx-1.5 my-0.5 p-0.5"
                      name="tujuan"
                      required
                    >
                      <option value="iot">IoT</option>
                      <option value="eec">EEC</option>
                      <option value="lf">LF</option>
                      <option value="tp">TP</option>
                      <option value="workshop">Workshop</option>
                      <option value="webinar">Webinar</option>
                    </select>
                  )}
                  {announceTo === "pengguna" && (
                    <input
                      className="mt-2 text-black-default w-full bg-transparent px-1.5 py-0.5 outline-none"
                      placeholder="Masukkan email pengguna"
                      name="tujuan"
                      autoComplete="off"
                      required
                    />
                  )}
                </div>
                <div className="my-2 flex flex-col gap-2">
                  <div className="px-2 py-1.5 bg-white-light rounded-md">
                    <label className="block px-1.5 text-sm text-black-default/75">
                      Judul
                    </label>
                    <input
                      className="w-full bg-transparent px-1.5 py-0.5 text-black-default outline-none"
                      placeholder="Masukkan judul pengumuman"
                      name="judul"
                      autoComplete="off"
                      required
                    />
                  </div>
                  <div className="px-2 py-1.5 bg-white-light rounded-md">
                    <label className="block px-1.5 text-sm text-black-default/75">
                      Isi
                    </label>
                    <textarea
                      className="w-full bg-transparent px-1.5 py-0.5 text-black-default outline-none"
                      placeholder="Masukkan isi pengumuman"
                      name="isi"
                      autoComplete="off"
                      required
                    />
                  </div>
                </div>
                <button
                  className="block w-fit ml-auto px-5 py-0.5 border border-white-light bg-white-default rounded-full text-green-default"
                  type="submit"
                >
                  Kirim
                </button>
              </form>
            ) : announcementData && announcementData.length > 0 ? (
              announcementData.map((p) => (
                <button
                  className="text-left bg-green-dark/30 hover:bg-green-dark/60 p-4 rounded-xl"
                  key={p.judul}
                  onClick={() => {
                    p.expand = !p.expand;
                    setForceUpdate((prev) => prev + 1);
                  }}
                >
                  <div className="flex gap-2 justify-between">
                    <h3 className="font-[Gotham]">{p.judul}</h3>
                    <button
                      className="block hover:text-red-400 material-icons-outlined"
                      onClick={() => deleteAnnouncement(p.penerima!, p.id!)}
                      title="Hapus pengumuman"
                    >
                      delete
                    </button>
                  </div>
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
        {data.statAcara && (
          <div className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-r from-red-default to-red-default/70 backdrop-blur-[5px] text-white-light">
            <h2 className="mb-4 font-[Gotham] text-xl">Statistik Acara</h2>
            <div className="flex flex-wrap gap-5">
              <div className="p-4 rounded-xl bg-red-dark/50 whitespace-nowrap">
                <p className="mb-1 font-bold">IoT</p>
                <p>Total pendaftar: {data.statAcara.iot.total}</p>
                {false && <p>Terverifikasi: {data.statAcara.iot.verifikasi}</p>}
              </div>
              <div className="p-4 rounded-xl bg-red-dark/50 whitespace-nowrap">
                <p className="mb-1 font-bold">EEC</p>
                <p>Total pendaftar: {data.statAcara.eec.total}</p>
                {false && <p>Terverifikasi: {data.statAcara.eec.verifikasi}</p>}
              </div>
              <div className="p-4 rounded-xl bg-red-dark/50 whitespace-nowrap">
                <p className="mb-1 font-bold">Line Follower</p>
                <p>Total pendaftar: {data.statAcara.lf.total}</p>
                {false && <p>Terverifikasi: {data.statAcara.lf.verifikasi}</p>}
              </div>
              <div className="p-4 rounded-xl bg-red-dark/50 whitespace-nowrap">
                <p className="mb-1 font-bold">Transporter</p>
                <p>Total pendaftar: {data.statAcara.tp.total}</p>
                {false && <p>Terverifikasi: {data.statAcara.tp.verifikasi}</p>}
              </div>
              <div className="p-4 rounded-xl bg-red-dark/50 whitespace-nowrap">
                <p className="mb-1 font-bold">Webinar</p>
                <p>Total pendaftar: {data.statAcara.webinar.total}</p>
                {false && (
                  <p>Terverifikasi: {data.statAcara.webinar.verifikasi}</p>
                )}
              </div>
              <div className="p-4 rounded-xl bg-red-dark/50 whitespace-nowrap">
                <p className="mb-1 font-bold">Workshop</p>
                <p>Total pendaftar: {data.statAcara.workshop.total}</p>
                {false && (
                  <p>Terverifikasi: {data.statAcara.workshop.verifikasi}</p>
                )}
              </div>
            </div>
          </div>
        )}
        {false && data.statTanya && (
          <div className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-r from-red-default to-red-default/70 backdrop-blur-[5px] text-white-light">
            <h2 className="mb-4 font-[Gotham] text-xl">Statistik Pertanyaan</h2>
            <div className="flex flex-wrap gap-5">
              <div className="p-4 rounded-xl bg-red-dark/50 whitespace-nowrap">
                <p className="mb-1 font-bold">IoT</p>
                <p>Belum terjawab: {data.statTanya.iot.belumTerjawab}</p>
                <p>Terjawab: {data.statTanya.iot.terjawab}</p>
                <p>Total: {data.statTanya.iot.total}</p>
              </div>
              <div className="p-4 rounded-xl bg-red-dark/50 whitespace-nowrap">
                <p className="mb-1 font-bold">EEC</p>
                <p>Belum terjawab: {data.statTanya.eec.belumTerjawab}</p>
                <p>Terjawab: {data.statTanya.eec.terjawab}</p>
                <p>Total: {data.statTanya.eec.total}</p>
              </div>
              <div className="p-4 rounded-xl bg-red-dark/50 whitespace-nowrap">
                <p className="mb-1 font-bold">Line Follower</p>
                <p>Belum terjawab: {data.statTanya.lf.belumTerjawab}</p>
                <p>Terjawab: {data.statTanya.lf.terjawab}</p>
                <p>Total: {data.statTanya.lf.total}</p>
              </div>
              <div className="p-4 rounded-xl bg-red-dark/50 whitespace-nowrap">
                <p className="mb-1 font-bold">Transporter</p>
                <p>Belum terjawab: {data.statTanya.tp.belumTerjawab}</p>
                <p>Terjawab: {data.statTanya.tp.terjawab}</p>
                <p>Total: {data.statTanya.tp.total}</p>
              </div>
              <div className="p-4 rounded-xl bg-red-dark/50 whitespace-nowrap">
                <p className="mb-1 font-bold">Webinar</p>
                <p>Belum terjawab: {data.statTanya.webinar.belumTerjawab}</p>
                <p>Terjawab: {data.statTanya.webinar.terjawab}</p>
                <p>Total: {data.statTanya.webinar.total}</p>
              </div>
              <div className="p-4 rounded-xl bg-red-dark/50 whitespace-nowrap">
                <p className="mb-1 font-bold">Workshop</p>
                <p>Belum terjawab: {data.statTanya.workshop.belumTerjawab}</p>
                <p>Terjawab: {data.statTanya.workshop.terjawab}</p>
                <p>Total: {data.statTanya.workshop.total}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex-none w-full xl:w-[373px]">
        <Timeline rundown={data.rundown} />
      </div>
    </div>
  );
}
