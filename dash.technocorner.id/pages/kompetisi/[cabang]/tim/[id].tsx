import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import competitions from "../../../../data/competitions.json";
import { getData, postData, putData } from "../../../../lib/method";
import toast from "react-hot-toast";
import Loading from "../../../../components/pages/Loading";
import config from "../../../../data/config";
import {
  toastError,
  toastLoading,
  toastLoadingProgress,
  toastSendMail,
  toastSuccess,
} from "../../../../lib/toast";
import { toastInfo } from "../../../../lib/toastInfo";
import HtmlHead from "../../../../components/main/HtmlHead";
import link from "../../../../data/link";
import server from "../../../../data/server";
import client from "../../../../data/client";
import { verifyUri } from "../../../../lib/verifyUri";

let data: {
  id: string;
  nama: string;
  tahap: {
    idTahapTim: number;
    tahapTim: string;
    idTahapJadwal: number;
    semuaTahap: Array<string>;
  };
  biaya: string;
  bayar: boolean;
  pembayaran: string;
  tahanVerifikasi: boolean;
  verifikasi: boolean;
  verifikasiEmailTerkirim: boolean;
  peserta: Array<{
    id: string;
    nama: string;
    verifikasi: string;
    syarat?: { twibbon: string };
  }>;
  pengguna: string;
  proposal?: string;
  video?: string;
  syarat: { twibbon: string };
  peran: string;
} = {
  id: "",
  nama: "",
  tahap: { idTahapTim: 0, tahapTim: "", idTahapJadwal: 0, semuaTahap: [] },
  biaya: "",
  bayar: true,
  pembayaran: "",
  tahanVerifikasi: false,
  verifikasi: false,
  verifikasiEmailTerkirim: false,
  peserta: [],
  pengguna: "",
  proposal: "",
  video: "",
  syarat: { twibbon: "" },
  peran: "",
};
let title = "";
let query = { cabang: "", id: "" };
let bukuPedoman = "";
let loading = true;
let video = { uri: "", isValid: true };

const TeamPage = () => {
  const router = useRouter();
  const [forceRender, setForceRender] = useState(0);

  switch (query.cabang) {
    case "iot":
      bukuPedoman = `${link}/JuknisIoT`;
      break;
    case "eec":
      bukuPedoman = `${link}/JuknisEEC`;
      break;
    case "tp":
      bukuPedoman = `${link}/JuknisTP`;
      break;
    case "lf":
      bukuPedoman = `${link}/JuknisLF`;
      break;
  }

  async function refreshData(cabang: string, id: string) {
    const res = await getData(`/dashboard/kompetisi/${cabang}/tim/${id}`);
    if (res.success) {
      data = res.body;
      if (data.video) {
        video.uri = data.video;
      }
      loading = false;
      setForceRender((prev) => prev + 1);
    } else {
      router.replace("/kompetisi");
    }
  }

  useEffect(() => {
    if (Object.keys(router.query).length) {
      const { cabang, id } = router.query;
      title = (competitions as { [key: string]: string })[cabang as string];
      query = { cabang: cabang as string, id: id as string };
      setForceRender((prev) => prev + 1);

      (async () => {
        refreshData(cabang as string, id as string);
      })();
    }
  }, [router.isReady]);

  function payHelper() {
    toastInfo(`Silakan melakukan pembayaran sesuai dengan nominal yang ditentukan dari cabang lomba atau kegiatan yang diikuti ke:
    - 0083 0111 2967 506 (BRI) a.n. Calula Annisa M, atau
    - 081310439454 (Gopay) a.n. Andriansyah Rafi Rahmadhian.`);
  }

  async function changePhaseHandler(phase: number) {
    const loadingToast = toastLoading();
    const res = await putData(
      `/dashboard/kompetisi/${query.cabang}/ubah-tahap`,
      { id: data.id, tahap: phase }
    );

    toast.dismiss(loadingToast);
    if (res.success) {
      data.tahap = {
        ...data.tahap,
        idTahapTim: phase,
        tahapTim: data.tahap.semuaTahap[phase],
      };
      setForceRender((prev) => prev + 1);
      toastSuccess("Berhasil mengubah tahap");
    } else {
      toastError(res.body && res.body.error ? res.body.error : "Terjadi galat");
    }
  }

  async function uploadHandler(
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) {
    if (!event.target.files![0]) {
      return;
    }

    let loadingToast = toastLoadingProgress(0);

    let notValid = { type: false, size: false };
    switch (type) {
      case "twibbon":
      case "pembayaran":
        if (
          config.type.image.filter((t) => event.target.files![0].type === t)
            .length === 0
        ) {
          notValid.type = true;
        } else if (
          event.target.files![0].size < config.limit.image[0] ||
          event.target.files![0].size > config.limit.image[1]
        ) {
          notValid.size = true;
        }
        break;
      case "proposal":
        if (
          config.type.pdf.filter((t) => event.target.files![0].type === t)
            .length === 0
        ) {
          notValid.type = true;
        } else if (
          event.target.files![0].size < config.limit.pdf[0] ||
          event.target.files![0].size > config.limit.pdf[1]
        ) {
          notValid.size = true;
        }
        break;
    }
    if (Object.values(notValid).findIndex((v) => v === true) >= 0) {
      if (notValid.type) {
        let tipe = "";
        switch (type) {
          case "twibbon":
          case "pembayaran":
            tipe = config.type.image.join(" / ");
            break;
          case "proposal":
            tipe = config.type.pdf.join(" / ");
            break;
        }
        toast.dismiss(loadingToast);
        return toastError(`Berkas harus bertipe ${tipe}`);
      }
      if (notValid.size) {
        let size: Array<number> = [];
        switch (type) {
          case "twibbon":
          case "pembayaran":
            size = config.limit.image;
            break;
          case "proposal":
            size = config.limit.pdf;
            break;
        }
        toast.dismiss(loadingToast);
        return toastError(
          `Berkas harus berukuran antara ${size[0] / 1024} kilobyte hingga ${
            size[1] / (1024 * 1024)
          } megabytes`
        );
      }
    }

    const formData = new FormData();
    formData.append(type, event.target.files![0]);

    const xhr = new XMLHttpRequest();

    xhr.withCredentials = true;

    xhr.open(
      "PUT",
      `${server[0]}/dashboard/kompetisi/${query.cabang}/${type}/${query.id}`
    );

    xhr.upload.addEventListener("progress", (data) => {
      if (data.lengthComputable) {
        const percentage = Math.floor((data.loaded / data.total) * 100);
        loadingToast = toastLoadingProgress(percentage);
        if (percentage === 100) {
          toast.dismiss(loadingToast);
          loadingToast = toastLoading();
        }
      }
    });

    xhr.send(formData);

    xhr.addEventListener("load", () => {
      const res = JSON.parse(xhr.responseText);

      if (res.success) {
        refreshData(query.cabang, query.id);
      }

      toast.dismiss(loadingToast);
      if (res.success) {
        toastSuccess("Berkas berhasil diunggah");
      } else {
        event.target.value = "";
        return toastError(
          res.body && res.body.error ? res.body.error : "Terjadi galat"
        );
      }
    });
  }

  async function saveVideoUri() {
    const loadingToast = toastLoading();

    if (!verifyUri(video.uri)) {
      video.isValid = false;
      setForceRender((prev) => prev + 1);
      toast.dismiss(loadingToast);
      return toastError("Tautan tidak valid");
    }

    const res = await putData(
      `/dashboard/kompetisi/${query.cabang}/video/${data.id}`,
      {
        videoUri: video.uri,
      }
    );

    toast.dismiss(loadingToast);
    if (res.success) {
      data.video = video.uri;
      setForceRender((prev) => prev + 1);
      toastSuccess("Tautan video berhasil disimpan");
    } else {
      toastError(
        res.body && res.body.error
          ? res.body.error
          : "Gagal menyimpan tautan video"
      );
    }
  }

  async function verifyHandler() {
    const loadingToast = toastLoading();

    const res = await putData(
      `/dashboard/kompetisi/${query.cabang}/verifikasi`,
      {
        id: data.id,
        verifikasi: !data.verifikasi,
      }
    );

    if (res.success) {
      data.verifikasi = !data.verifikasi;
      if (!data.verifikasi) {
        data.verifikasiEmailTerkirim = false;
      }
      setForceRender((prev) => prev + 1);
      toast.dismiss(loadingToast);
      toastSuccess(
        data.verifikasi
          ? "Verifikasi berhasil"
          : "Pembatalan verifikasi berhasil"
      );
    } else {
      toast.dismiss(loadingToast);
      toastError(res.body && res.body.error ? res.body.error : "Terjadi galat");
    }
  }

  async function holdVerification() {
    const loadingToast = toastLoading();

    const res = await putData(
      `/dashboard/kompetisi/${query.cabang}/tahan-verifikasi`,
      { id: data.id, tahanVerifikasi: !data.tahanVerifikasi }
    );

    toast.dismiss(loadingToast);
    if (res.success) {
      data.tahanVerifikasi = !data.tahanVerifikasi;
      setForceRender((prev) => prev + 1);
      toastSuccess(
        data.tahanVerifikasi
          ? "Berhasil membatalkan pengajuan verifikasi"
          : "Verifikasi diajukan"
      );
    } else {
      toastError(
        data.tahanVerifikasi
          ? "Gagal mengajukan verifikasi"
          : "Gagal membatalkan pengajuan verifikasi"
      );
    }
  }

  async function sendMail() {
    const loadingToast = toastSendMail(
      data.peserta[0].nama,
      data.peserta[0].id
    );

    const res = await postData(
      `/dashboard/kompetisi/${query.cabang}/tim/kirim-email/`,
      {
        acaraId: data.id,
        to: data.peserta[0].id,
        subject: "[Technocorner] Pemberitahuan Verifikasi Pendaftaran",
        text: `Pemberitahuan Verifikasi Pendaftaran\n\nHalo ${data.peserta[0].nama},\n\nkami dari panitia Technocorner UGM 2022 ingin mengonfirmasi bahwa Tim ${data.nama} telah valid terdaftar pada ${title}. Informasi lebih lanjut mengenai Technical Meeting dan informasi lainnya akan kami hubungi melalui email ini.\n\nTerima kasih.`,
        html: `<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width,minimum-scale=1,maximum-scale=1,user-scalable=0"><style type="text/css">.body{background-color:#f5f5f5;width:100%;height:100%;padding:2rem}.main{width:30rem;margin:auto;border:1px solid #d3d3d3}hr{border:1px solid #d3d3d3}@media only screen and (max-width:30rem){.body{background-color:#fff;padding:0}.main{width:100%}}</style></head><body style="margin:0"><div class="body"><div class="main"><div style="background-color:#fff;padding:1.25rem 2rem"><div style="display:flex;justify-content:center"><a href="${client.main}" style="text-decoration:inherit;color:inherit;margin-left:auto;margin-right:auto"><img src="cid:logo.png" style="width:3rem"></a></div><hr style="margin:1rem 0"><h1 style="text-align:center;font-size:larger">Pemberitahuan Verifikasi Pendaftaran</h1><p style="margin-top:2rem;text-align:justify">Halo ${data.peserta[0].nama},<br><br>kami dari panitia Technocorner UGM 2022 ingin mengonfirmasi bahwa <b>Tim ${data.nama}</b> telah valid terdaftar pada <b>${title}</b>. Informasi lebih lanjut mengenai Technical Meeting dan informasi lainnya akan kami hubungi melalui email ini.<br><br>Terima kasih.</p><hr style="margin:1rem 0"><div style="width:100%"><img src="cid:footerLogo.png" style="display:block;width:12.5rem;margin-left:auto;margin-right:auto"><div style="font-size:smaller;margin-top:1rem;text-align:center">Website : <a href="${client.main}" style="text-decoration:underline;color:inherit">technocorner.id</a> | Line : <a href="http://ugm.id/LineOfficial" style="text-decoration:underline;color:inherit">ugm.id/LineOfficial</a> | Instagram : <a href="https://instagram.com/technocornerugm" style="text-decoration:underline;color:inherit">@technocornerugm</a> | Facebook : <a href="https://facebook.com/TechnocornerUGM" style="text-decoration:underline;color:inherit">Technocorner UGM</a> | Twitter : <a href="https://twitter.com/technocornerUGM" style="text-decoration:underline;color:inherit">@technocornerUGM</a> | Youtube : <a href="https://youtube.com/Technocorner" style="text-decoration:underline;color:inherit">Technocorner</a> | TikTok : <a href="https://tiktok.com/@technocornerugm" style="text-decoration:underline;color:inherit">@technocornerugm</a></div></div></div></div></div></body></html>`,
        attachments: ["logo.png", "footerLogo.png"],
      }
    );

    toast.dismiss(loadingToast);

    if (res.success) {
      data.verifikasiEmailTerkirim = true;
      setForceRender((prev) => prev + 1);
      toastSuccess(
        `Berhasil mengirimkan email ke ${data.peserta[0].nama} (${data.peserta[0].id})`
      );
    } else {
      toastError(
        `Gagal mengirimkan email ke ${data.peserta[0].nama} (${data.peserta[0].id})`
      );
    }
  }

  return loading ? (
    <Loading />
  ) : (
    <>
      <HtmlHead title={`Tim ${data.nama}`} />
      {!data.id ? (
        <Loading />
      ) : (
        <>
          <h1 className="font-[GothamBold] text-2xl">{title}</h1>
          <div className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px] outline outline-2 outline-white-light">
            <p className="mb-3 font-[Gotham] text-lg md:text-xl">Data Tim</p>
            <div className="flex flex-col gap-3">
              {data.tahap.idTahapJadwal > 1 && (
                <div className="flex flex-col text-center">
                  {data.peran === "admin" && (
                    <p className="font-bold">Laman peserta akan menampilkan:</p>
                  )}
                  {data.tahap.idTahapTim >= data.tahap.idTahapJadwal ? (
                    <p>
                      <span className="text-green-default">Selamat!</span> Tim{" "}
                      {data.nama} lolos ke tahap {data.tahap.tahapTim}.
                    </p>
                  ) : (
                    <p>
                      <span className="text-red-default">Maaf.</span> Tim{" "}
                      {data.nama} tidak lolos ke tahap selanjutnya.
                    </p>
                  )}
                </div>
              )}
              <div>
                <p className="font-bold">ID Tim</p>
                <p>{data.id}</p>
              </div>
              <div>
                <p className="font-bold">Nama Tim</p>
                <p>{data.nama}</p>
              </div>
              {data.tahap && data.tahap.tahapTim && (
                <div>
                  <p className="font-bold">Tahap</p>
                  <p className="flex flex-wrap whitespace-pre">
                    {data.peran !== "admin" ? (
                      data.tahap.tahapTim
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {data.tahap.semuaTahap.map((t, index) => (
                          <button
                            className={`relative left-0 rounded-full border px-3 py-0.5 text-sm ${
                              index === data.tahap.idTahapTim
                                ? "border-green-default text-green-default"
                                : "border-black-default"
                            }`}
                            onClick={() => changePhaseHandler(index)}
                            key={t}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </p>
                </div>
              )}
              <div>
                <p className="font-bold">Buku Panduan</p>
                <a
                  className="hover:underline"
                  href={bukuPedoman}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Lihat buku panduan
                </a>
              </div>
              {data.peran === "pengguna" && (
                <div>
                  <div className="flex gap-1 items-center">
                    <p className="font-bold">Twibbon</p>
                    <a
                      className="material-icons-outlined hover:text-blue-light"
                      href={`${link}/Twibbon`}
                      target="_blank"
                      rel="noreferrer noopener"
                      title="Template twibbon"
                    >
                      link
                    </a>
                  </div>
                  <div className="flex flex-col gap-1">
                    {data.syarat.twibbon ? (
                      <a
                        className="w-fit hover:underline"
                        href={data.syarat.twibbon}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Lihat twibbon terunggah
                      </a>
                    ) : (
                      <p className="flex gap-1 items-center text-red-default">
                        <span className="material-icons-outlined">close</span>{" "}
                        Belum mengunggah twibbon
                      </p>
                    )}
                    {!data.verifikasi && data.tahap.idTahapJadwal < 2 && (
                      <div className="relative flex items-center">
                        <input
                          id="twibbon"
                          name="twibbon"
                          type="file"
                          accept={config.type.image.join(", ")}
                          onChange={(event) => uploadHandler(event, "twibbon")}
                          hidden
                        />
                        <label
                          className="rounded-full border border-green-default px-3 py-0.5 text-sm text-green-default cursor-pointer"
                          htmlFor="twibbon"
                        >
                          Unggah twibbon
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {query.cabang === "iot" && (
                <>
                  <div>
                    <p className="font-bold">Proposal</p>
                    <div className="flex flex-col gap-1">
                      {data.proposal ? (
                        <a
                          className="w-fit hover:underline"
                          href={data.proposal}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          Lihat proposal terunggah
                        </a>
                      ) : (
                        <p className="flex gap-1 items-center text-red-default">
                          <span className="material-icons-outlined">close</span>{" "}
                          {data.peran === "pengguna"
                            ? data.peserta.length > 0 &&
                              data.pengguna ===
                                (data.peserta[0] as { id: string }).id
                              ? "Belum mengunggah proposal"
                              : "Ketua belum mengunggah proposal"
                            : "Tidak ada proposal terunggah"}
                        </p>
                      )}
                      {data.peserta.length > 0 &&
                        data.pengguna ===
                          (data.peserta[0] as { id: string }).id &&
                        !data.verifikasi &&
                        data.tahap.idTahapJadwal < 2 && (
                          <div className="relative flex items-center">
                            <input
                              id="proposal"
                              name="proposal"
                              type="file"
                              accept={config.type.pdf.join(", ")}
                              onChange={(event) =>
                                uploadHandler(event, "proposal")
                              }
                              hidden
                            />
                            <label
                              className="rounded-full border border-green-default px-3 py-0.5 text-sm text-green-default cursor-pointer"
                              htmlFor="proposal"
                            >
                              Unggah proposal
                            </label>
                          </div>
                        )}
                    </div>
                  </div>
                  {data.tahap.idTahapTim >= 2 && (
                    <div>
                      <p className="font-bold">Tautan Video</p>
                      <div className="flex flex-col gap-1">
                        {!data.verifikasi &&
                        data.tahap.idTahapTim === 2 &&
                        data.peran === "pengguna" ? (
                          <>
                            <input
                              className={`w-full px-2 py-1 border border-slate-400 rounded-md placeholder-slate-400 focus:outline-none ${
                                !video.isValid
                                  ? "!border-red-default ring-red-default ring-1"
                                  : "focus:border-teal-400 focus:ring-teal-400 focus:ring-1"
                              }`}
                              onChange={(event) => {
                                if (!video.isValid) {
                                  video.isValid = true;
                                }
                                video.uri = event.currentTarget.value;
                                setForceRender((prev) => prev + 1);
                              }}
                              value={video.uri}
                            />
                            <button
                              className="w-fit px-5 py-1 rounded-md bg-green-default text-white-light"
                              type="button"
                              onClick={saveVideoUri}
                            >
                              Simpan
                            </button>
                          </>
                        ) : data.video ? (
                          <a
                            className="w-fit hover:underline"
                            href={data.video}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            Lihat video terunggah
                          </a>
                        ) : (
                          <p className="flex gap-1 items-center text-red-default">
                            <span className="material-icons-outlined">
                              close
                            </span>{" "}
                            Peserta belum mengumpulkan video
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
              <div>
                <div className="flex gap-1 items-center">
                  <p className="font-bold">Biaya Pendaftaran</p>
                  {data.bayar && (
                    <button
                      className="material-icons-outlined hover:text-blue-light"
                      onClick={payHelper}
                      title="Informasi pembayaran"
                    >
                      help_outline
                    </button>
                  )}
                </div>
                <p>{data.biaya}</p>
              </div>
              {data.bayar && (
                <div>
                  <p className="font-bold">Bukti Pembayaran</p>
                  <div className="flex flex-col gap-1">
                    {data.pembayaran ? (
                      <a
                        className="w-fit hover:underline"
                        href={data.pembayaran}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Lihat bukti pembayaran
                      </a>
                    ) : (
                      <p className="flex gap-1 items-center text-red-default">
                        <span className="material-icons-outlined">close</span>{" "}
                        {data.peran === "pengguna"
                          ? data.peserta.length > 0 &&
                            data.pengguna ===
                              (data.peserta[0] as { id: string }).id
                            ? "Belum mengunggah bukti pembayaran"
                            : "Ketua belum mengunggah bukti pembayaran"
                          : "Tidak ada bukti pembayaran terunggah"}
                      </p>
                    )}
                    {data.peserta.length > 0 &&
                      data.pengguna ===
                        (data.peserta[0] as { id: string }).id &&
                      !data.verifikasi && (
                        <div className="relative flex items-center">
                          <input
                            id="pembayaran"
                            name="pembayaran"
                            type="file"
                            accept={config.type.image.join(", ")}
                            onChange={(event) =>
                              uploadHandler(event, "pembayaran")
                            }
                            hidden
                          />
                          <label
                            className="rounded-full border border-green-default px-3 py-0.5 text-sm text-green-default cursor-pointer"
                            htmlFor="pembayaran"
                          >
                            Unggah bukti pembayaran
                          </label>
                        </div>
                      )}
                  </div>
                </div>
              )}
              <div>
                <p className="font-bold">Status</p>
                <div className="flex flex-col flex-wrap gap-2">
                  {data.verifikasi ? (
                    <p className="flex gap-1 items-center text-green-default">
                      <span className="material-icons-outlined">check</span>{" "}
                      Terverifikasi
                    </p>
                  ) : (query.cabang === "iot"
                      ? !data.bayar
                        ? data.proposal
                        : data.proposal && data.video && data.pembayaran
                      : data.pembayaran) &&
                    data.peserta.filter((p) => !p.syarat!.twibbon).length ===
                      0 ? (
                    <>
                      {data.tahanVerifikasi ? (
                        <p className="flex gap-1 items-center text-red-default">
                          <span className="material-icons-outlined">close</span>{" "}
                          Verifikasi belum diajukan
                        </p>
                      ) : (
                        <p className="flex gap-1 items-center">
                          <span className="material-icons-outlined">
                            autorenew
                          </span>{" "}
                          {data.peran === "pengguna"
                            ? "Dalam proses"
                            : "Menunggu"}{" "}
                          verifikasi
                        </p>
                      )}
                      {data.peran === "pengguna" && query.cabang === "iot" && (
                        <button
                          className={`w-fit rounded-full border px-3 py-0.5 text-sm ${
                            data.tahanVerifikasi
                              ? "border-green-default text-green-default"
                              : "border-red-default text-red-default"
                          }`}
                          onClick={holdVerification}
                        >
                          {data.tahanVerifikasi
                            ? "Ajukan"
                            : "Batalkan pengajuan"}{" "}
                          verifikasi
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="flex gap-1 items-center text-red-default">
                      <span className="material-icons-outlined">close</span>{" "}
                      Data pendaftaran belum lengkap.
                      {data.peserta.length > 0 &&
                        data.peserta.findIndex((p) => !p.syarat!.twibbon) >=
                          0 &&
                        " Pastikan juga setiap peserta telah mengunggah twibbon."}
                    </p>
                  )}
                  {data.peran === "admin" && (
                    <>
                      {!data.tahanVerifikasi &&
                        (data.verifikasi ||
                          ((query.cabang === "iot"
                            ? !data.bayar
                              ? data.proposal
                              : data.proposal && data.video && data.pembayaran
                            : data.pembayaran) &&
                            data.peserta.filter((p) => !p.syarat!.twibbon)
                              .length === 0)) && (
                          <button
                            className={`w-fit rounded-full border px-3 py-0.5 text-sm ${
                              data.verifikasi
                                ? "border-red-default text-red-default"
                                : "border-green-default text-green-default"
                            }`}
                            onClick={verifyHandler}
                          >
                            {data.verifikasi
                              ? "Hapus verifikasi"
                              : "Verifikasi"}
                          </button>
                        )}
                      {data.verifikasi && (
                        <button
                          className={`w-fit flex items-center gap-1 rounded-full border px-3 py-0.5 text-sm ${
                            data.verifikasiEmailTerkirim
                              ? "border-green-default text-green-default"
                              : "border-black-default"
                          }`}
                          onClick={sendMail}
                          title={
                            data.verifikasiEmailTerkirim
                              ? "Email sudah dikirim"
                              : "Email belum dikirim"
                          }
                        >
                          {data.verifikasiEmailTerkirim
                            ? "Email pemberitahuan verifikasi sudah dikirim"
                            : "Kirim email pemberitahuan verifikasi"}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px] outline outline-2 outline-white-light">
            <p className="mb-3 font-[Gotham] text-lg md:text-xl">Peserta Tim</p>
            <div className="flex flex-col gap-3">
              {data.peserta.map((a, index) => (
                <div key={a.id}>
                  {data.peran === "pengguna" && (
                    <p className="font-bold">
                      {a.nama} {index === 0 && "(Ketua)"}{" "}
                      {data.pengguna === a.id && "(Saya)"}
                    </p>
                  )}
                  {data.peran === "admin" && (
                    <a
                      className="font-bold hover:underline"
                      href={`/pengguna/${a.id}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {a.nama} {index === 0 && "(Ketua)"}
                    </a>
                  )}
                  {a.verifikasi ? (
                    <p className="flex gap-1 items-center text-green-default">
                      <span className="material-icons-outlined">check</span>{" "}
                      Identitas terverifikasi
                    </p>
                  ) : (
                    <p className="flex gap-1 items-center text-red-default">
                      <span className="material-icons-outlined">close</span>{" "}
                      Identitas belum terverifikasi
                    </p>
                  )}
                  {data.peran === "pengguna" &&
                    (a.syarat?.twibbon ? (
                      <p className="flex gap-1 items-center text-green-default">
                        <span className="material-icons-outlined">check</span>{" "}
                        Telah mengunggah twibbon
                      </p>
                    ) : (
                      <p className="flex gap-1 items-center text-red-default">
                        <span className="material-icons-outlined">close</span>{" "}
                        Belum mengunggah twibbon
                      </p>
                    ))}
                  {data.peran === "admin" &&
                    (a.syarat?.twibbon ? (
                      <p className="flex gap-1 items-center">
                        <span className="material-icons-outlined">link</span>{" "}
                        <a
                          className="hover:underline"
                          href={a.syarat.twibbon}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          Lihat twibbon terunggah
                        </a>
                      </p>
                    ) : (
                      <p className="flex gap-1 items-center text-red-default">
                        <span className="material-icons-outlined">close</span>{" "}
                        Twibbon tidak ditemukan
                      </p>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TeamPage;
