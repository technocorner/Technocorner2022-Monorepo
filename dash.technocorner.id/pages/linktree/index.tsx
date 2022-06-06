import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import HtmlHead from "../../components/main/HtmlHead";
import config from "../../data/config";
import link from "../../data/link";
import {
  deleteData,
  getData,
  postData,
  putData,
  putFormData,
} from "../../lib/method";
import { toastError, toastLoading, toastSuccess } from "../../lib/toast";
import { verifyCustomUri, verifyUri } from "../../lib/verifyUri";

const initData: {
  links: Array<{
    judul: string;
    tautanPendek: string;
    tautanPanjang: string;
  }>;
  settings: {
    judulProfil: string;
    bio: string;
    warnaTeksProfil: string;
    warnaLatar: string;
    warnaBackdrop: string;
    backdropBlurLatar: number;
    transparansiTombol: number;
    bulatanTombol: number;
    backdropBlurTombol: number;
    fotoProfil: string;
    gambarLatar: string;
  };
} = {
  links: [],
  settings: {
    judulProfil: "",
    bio: "",
    warnaTeksProfil: "",
    warnaLatar: "",
    warnaBackdrop: "",
    backdropBlurLatar: 0,
    transparansiTombol: 0,
    bulatanTombol: 0,
    backdropBlurTombol: 0,
    fotoProfil: "",
    gambarLatar: "",
  },
};

export default function LinkTree({ role }: { role: string }) {
  const router = useRouter();
  const [data, setData] = useState(initData);
  const [forceRender, setForceRender] = useState(0);
  const [notFilled, setNotFilled] = useState({
    judulTautan: false,
    tautanPanjang: false,
    tautanPendek: false,
    fotoProfil: false,
    gambarLatar: false,
  });

  useEffect(() => {
    if (role && router.isReady && role !== "admin") {
      router.replace("/");
    }
  }, [role, router.isReady]);

  async function refreshData() {
    const res = await getData("/linktree/tautan");
    if (!res.success) {
      return toastError(res.body.error);
    }
    setData(res.body);
  }

  useEffect(() => {
    (async () => {
      refreshData();
    })();
  }, []);

  async function submitLinkHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const loadingToast = toastLoading();

    const target = event.target as typeof event.target & {
      judulTautan: { value: string };
      tautanPanjang: { value: string };
      tautanPendek: { value: string };
      warnaTeks: { value: string };
      warnaLatar: { value: string };
    };

    let notFilled = {
      judulTautan: false,
      tautanPanjang: false,
      tautanPendek: false,
      fotoProfil: false,
      gambarLatar: false,
    };
    if (!target.judulTautan.value) {
      notFilled.judulTautan = true;
    }
    if (!target.tautanPanjang.value) {
      notFilled.tautanPanjang = true;
    }
    if (!target.tautanPendek.value) {
      notFilled.tautanPendek = true;
    }
    if (Object.values(notFilled).findIndex((v) => v === true) >= 0) {
      setNotFilled(notFilled);
      toast.dismiss(loadingToast);
      return toastError("Data form belum lengkap");
    }

    const judulTautan = target.judulTautan.value;
    const tautanPanjang = target.tautanPanjang.value;
    const tautanPendek = target.tautanPendek.value;
    const warnaTeks = target.warnaTeks
      ? target.warnaTeks.value.trim()
      : "#000000";
    const warnaLatar = target.warnaLatar
      ? target.warnaLatar.value.trim()
      : "#FFFFFF";

    if (!verifyUri(tautanPanjang)) {
      toast.dismiss(loadingToast);
      notFilled.tautanPanjang = true;
      setNotFilled(notFilled);
      return toastError("Tautan panjang tidak valid");
    } else if (!verifyCustomUri(tautanPendek)) {
      toast.dismiss(loadingToast);
      notFilled.tautanPendek = true;
      setNotFilled(notFilled);
      return toastError("Tautan pendek tidak valid");
    }

    const res = await postData("/linktree/tautan", {
      judulTautan,
      tautanPanjang,
      tautanPendek,
      warnaTeks,
      warnaLatar,
      urutan: data.links.length,
    });

    toast.dismiss(loadingToast);
    if (res.success) {
      target.judulTautan.value = "";
      target.tautanPanjang.value = "";
      target.tautanPendek.value = "";
      target.warnaTeks.value = "";
      target.warnaLatar.value = "";

      setForceRender((prev) => prev + 1);
      setData((prev) => {
        const links = [...prev.links];
        links.unshift({ judul: judulTautan, tautanPanjang, tautanPendek });
        return { ...prev, links };
      });
      toastSuccess("Berhasil membuat tautan LinkTree");
    } else {
      toastError(res.body.error);
    }
  }

  async function changeLinkOrder(urutan: number, arah: string) {
    const links = [...data.links];
    if (arah === "UP") {
      [links[urutan - 1], links[urutan]] = [links[urutan], links[urutan - 1]];
    } else if (arah === "DOWN") {
      [links[urutan], links[urutan + 1]] = [links[urutan + 1], links[urutan]];
    }

    const linksOrder: Array<{ tautanPendek: string; urutan: number }> = [];
    links.forEach((l, index) =>
      linksOrder.push({
        tautanPendek: l.tautanPendek,
        urutan: data.links.length - index - 1,
      })
    );

    const res = await putData("/linktree/tautan/urutan", { linksOrder });

    if (res.success) {
      setForceRender((prev) => prev + 1);
      setData((prev) => {
        return { ...prev, links };
      });
    } else {
      toastError("Gagal mengubah urutan tautan");
    }
  }

  async function deleteLink(tautanPendek: string) {
    const loadingToast = toastLoading();

    const res = await deleteData("/linktree/tautan", { tautanPendek });

    toast.dismiss(loadingToast);
    if (res.success) {
      setForceRender((prev) => prev + 1);
      setData((prevData) => {
        return {
          ...prevData,
          links: prevData.links.filter((l) => l.tautanPendek !== tautanPendek),
        };
      });
      toastSuccess("Berhasil menghapus tautan");
    } else {
      toastError(res.body.error);
    }
  }

  async function submitAppearanceHandler(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    const loadingToast = toastLoading();

    const target = event.target as typeof event.target & {
      judulProfil: { value: string };
      bio: { value: string };
      fotoProfil: { files: FileList; value: string };
      gambarLatar: { files: FileList; value: string };
      warnaTeksProfil: { value: string };
      warnaLatar: { value: string };
      warnaBackdrop: { value: string };
      backdropBlurLatar: { value: string };
      transparansiTombol: { value: string };
      bulatanTombol: { value: string };
      warnaTeksTombol: { value: string };
      warnaLatarTombol: { value: string };
      backdropBlurTombol: { value: string };
    };

    let notFilled = {
      judulTautan: false,
      tautanPanjang: false,
      tautanPendek: false,
      fotoProfil: false,
      gambarLatar: false,
    };
    let notValid = { type: false, size: false };

    if (
      target.fotoProfil.files.length > 0 &&
      !target.fotoProfil.files[0].type.includes("image/")
    ) {
      notFilled.fotoProfil = true;
      notValid.type = true;
    }
    if (
      target.gambarLatar.files.length > 0 &&
      !target.gambarLatar.files[0].type.includes("image/")
    ) {
      notFilled.gambarLatar = true;
      notValid.type = true;
    }
    if (
      target.fotoProfil.files.length > 0 &&
      target.fotoProfil.files[0].size < config.limit.linktree[0]
    ) {
      notFilled.fotoProfil = true;
      notValid.size = true;
    }
    if (
      target.gambarLatar.files.length > 0 &&
      target.gambarLatar.files[0].size < config.limit.linktree[0]
    ) {
      notFilled.gambarLatar = true;
      notValid.size = true;
    }

    if (Object.values(notValid).findIndex((v) => v === true) >= 0) {
      setNotFilled(notFilled);

      if (notValid.type) {
        const tipe = config.type.linktree.join(" / ");
        toast.dismiss(loadingToast);
        return toastError(`Berkas harus bertipe ${tipe}`);
      }

      if (notValid.size) {
        const size = config.limit.linktree;
        toast.dismiss(loadingToast);
        return toastError(
          `Berkas harus berukuran minimal ${size[0] / 1024} kilobyte`
        );
      }
    }

    const formData = new FormData();

    if (target.fotoProfil.files[0]) {
      formData.append("attachments", target.fotoProfil.files[0]);
      formData.append("attachmentsDetail", "fotoProfil");
    }
    if (target.gambarLatar.files[0]) {
      formData.append("attachments", target.gambarLatar.files[0]);
      formData.append("attachmentsDetail", "gambarLatar");
    }
    (
      [
        "judulProfil",
        "bio",
        "warnaTeksProfil",
        "warnaLatar",
        "warnaBackdrop",
        "backdropBlurLatar",
        "transparansiTombol",
        "bulatanTombol",
        "warnaTeksTombol",
        "warnaLatarTombol",
        "backdropBlurTombol",
      ] as const
    ).forEach((t) => formData.append(t, target[t].value));

    const res = await putFormData("/linktree/pengaturan", formData);

    toast.dismiss(loadingToast);
    if (res.success) {
      setForceRender((prev) => prev + 1);
      if (target.bio.value === "null") {
        target.bio.value = "";
      }
      setData((prev) => {
        return {
          ...prev,
          settings: {
            judulProfil: target.judulProfil.value
              ? target.judulProfil.value
              : prev.settings.judulProfil,
            bio: target.bio.value ? target.bio.value : prev.settings.bio,
            warnaTeksProfil: target.warnaTeksProfil.value
              ? target.warnaTeksProfil.value
              : prev.settings.warnaTeksProfil,
            warnaLatar: target.warnaLatar.value
              ? target.warnaLatar.value
              : prev.settings.warnaLatar,
            warnaBackdrop: target.warnaBackdrop.value
              ? target.warnaBackdrop.value
              : prev.settings.warnaBackdrop,
            backdropBlurLatar: target.backdropBlurLatar.value
              ? Number(target.backdropBlurLatar.value)
              : prev.settings.backdropBlurLatar,
            transparansiTombol: target.transparansiTombol.value
              ? Number(target.transparansiTombol.value)
              : prev.settings.transparansiTombol,
            bulatanTombol: target.bulatanTombol.value
              ? Number(target.bulatanTombol.value)
              : prev.settings.bulatanTombol,
            backdropBlurTombol: target.backdropBlurTombol.value
              ? Number(target.backdropBlurTombol.value)
              : prev.settings.backdropBlurTombol,
            fotoProfil: target.fotoProfil.value
              ? target.fotoProfil.value
              : prev.settings.fotoProfil,
            gambarLatar: target.gambarLatar.value
              ? target.gambarLatar.value
              : prev.settings.gambarLatar,
          },
        };
      });
      (
        [
          "judulProfil",
          "bio",
          "warnaTeksProfil",
          "warnaLatar",
          "warnaBackdrop",
          "backdropBlurLatar",
          "transparansiTombol",
          "bulatanTombol",
          "warnaTeksTombol",
          "warnaLatarTombol",
          "backdropBlurTombol",
          "fotoProfil",
          "gambarLatar",
        ] as const
      ).forEach((t) => (target[t].value = ""));
      toastSuccess("Berhasil memperbarui tampilan");
    } else {
      toastError("Gagal memperbarui tampilan");
    }
  }

  async function deleteAppearanceSetting(type: string) {
    const loadingToast = toastLoading();
    const res = await deleteData("/linktree/pengaturan", { type });

    toast.dismiss(loadingToast);
    if (res.success) {
      setForceRender((prev) => prev + 1);
      setData((prev) => {
        const settings = prev.settings;
        (settings as { [key: string]: string | number })[type] = "";
        return { ...prev, settings };
      });
      toastSuccess("Berhasil menghapus gambar");
    } else {
      toastError("Gagal menghapus gambar");
    }
  }

  return (
    <>
      <HtmlHead title="LinkTree" />
      <div className="flex gap-8">
        <div className="w-full min-w-0 lg:flex-grow">
          <h1 className="font-[GothamBold] text-2xl">LinkTree</h1>
          <div className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px] outline outline-2 outline-white-light">
            <h2 className="mb-3 font-[Gotham] text-lg md:text-xl">
              Tampilan LinkTree
            </h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={submitAppearanceHandler}
            >
              <div className="px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400">
                <label className="block px-1.5 text-sm text-black-default/75">
                  Judul Profil
                </label>
                <input
                  className="w-full bg-transparent px-1.5 py-0.5 outline-none"
                  name="judulProfil"
                  placeholder={
                    data.settings.judulProfil
                      ? data.settings.judulProfil
                      : "Masukkan judul profil"
                  }
                  autoComplete="off"
                />
              </div>
              <div className="px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400">
                <label className="block px-1.5 text-sm text-black-default/75">
                  Bio (Isi &quot;null&quot; untuk Menghapus)
                </label>
                <input
                  className="w-full bg-transparent px-1.5 py-0.5 outline-none"
                  name="bio"
                  placeholder={
                    data.settings.bio ? data.settings.bio : "Masukkan bio"
                  }
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400">
                  <div className="flex items-center justify-between">
                    <label className="block px-1.5 text-sm text-black-default/75">
                      Foto Profil
                    </label>
                    {data.settings.fotoProfil && (
                      <button
                        className="block hover:text-red-400 material-icons-outlined"
                        type="button"
                        onClick={() => deleteAppearanceSetting("fotoProfil")}
                        title="Hapus foto profil"
                      >
                        delete
                      </button>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <label className="absolute z-10 cursor-pointer rounded-full">
                      <input
                        className="w-[8.7rem] file:w-0 file:m-0 file:px-0 file:py-1 file:border-0 text-sm invisible"
                        name="fotoProfil"
                        type="file"
                        accept={config.type.linktree.join(", ")}
                      />
                    </label>
                    <button className="relative left-0 rounded-full border border-green-default px-3 py-0.5 text-sm text-green-default">
                      Unggah foto profil
                    </button>
                  </div>
                </div>
                <div className="px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400">
                  <div className="flex items-center justify-between">
                    <label className="block px-1.5 text-sm text-black-default/75">
                      Gambar Latar
                    </label>
                    {data.settings.gambarLatar && (
                      <button
                        className="block hover:text-red-400 material-icons-outlined"
                        type="button"
                        onClick={() => deleteAppearanceSetting("gambarLatar")}
                        title="Hapus gambar latar"
                      >
                        delete
                      </button>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <label className="absolute z-10 cursor-pointer rounded-full">
                      <input
                        className="w-[9.8rem] file:w-0 file:m-0 file:px-0 file:py-1 file:border-0 text-sm invisible"
                        name="gambarLatar"
                        type="file"
                        accept={config.type.linktree.join(", ")}
                      />
                    </label>
                    <button className="relative left-0 rounded-full border border-green-default px-3 py-0.5 text-sm text-green-default">
                      Unggah gambar latar
                    </button>
                  </div>
                </div>
                <div className="px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400">
                  <label className="block px-1.5 text-sm text-black-default/75">
                    Warna Teks Profil (Hex Color)
                  </label>
                  <input
                    className="w-full bg-transparent px-1.5 py-0.5 outline-none"
                    name="warnaTeksProfil"
                    placeholder={`Saat ini: ${
                      data.settings.warnaTeksProfil
                        ? data.settings.warnaTeksProfil
                        : "#000000 (hitam)"
                    }`}
                    autoComplete="off"
                  />
                </div>
                <div className="px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400">
                  <label className="block px-1.5 text-sm text-black-default/75">
                    Warna Latar (Hex Color)
                  </label>
                  <input
                    className="w-full bg-transparent px-1.5 py-0.5 outline-none"
                    name="warnaLatar"
                    placeholder={`Saat ini: ${
                      data.settings.warnaLatar
                        ? data.settings.warnaLatar
                        : "#FFFFFF (putih)"
                    }`}
                    autoComplete="off"
                  />
                </div>
                <div className="px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400">
                  <label className="block px-1.5 text-sm text-black-default/75">
                    Warna Backdrop (Hex Color)
                  </label>
                  <input
                    className="w-full bg-transparent px-1.5 py-0.5 outline-none"
                    name="warnaBackdrop"
                    placeholder={`Saat ini: ${
                      data.settings.warnaBackdrop
                        ? data.settings.warnaBackdrop
                        : "#FFFFFF (putih)"
                    }`}
                    autoComplete="off"
                  />
                </div>
                <div className="px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400">
                  <label className="block px-1.5 text-sm text-black-default/75">
                    Backdrop Blur Latar (Angka)
                  </label>
                  <input
                    className="w-full bg-transparent px-1.5 py-0.5 outline-none"
                    name="backdropBlurLatar"
                    type="number"
                    placeholder={`Saat ini: ${
                      data.settings.backdropBlurLatar.toString() !== ""
                        ? data.settings.backdropBlurLatar
                        : "0 (tidak ada)"
                    }`}
                    autoComplete="off"
                  />
                </div>
                <div className="px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400">
                  <label className="block px-1.5 text-sm text-black-default/75">
                    Transparansi Tombol (0-1)
                  </label>
                  <input
                    className="w-full bg-transparent px-1.5 py-0.5 outline-none"
                    name="transparansiTombol"
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    placeholder={`Saat ini: ${
                      data.settings.transparansiTombol.toString() !== ""
                        ? data.settings.transparansiTombol
                        : "1 (tak transparan)"
                    }`}
                    autoComplete="off"
                  />
                </div>
                <div className="px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400">
                  <label className="block px-1.5 text-sm text-black-default/75">
                    Bulatan Tombol (Angka)
                  </label>
                  <input
                    className="w-full bg-transparent px-1.5 py-0.5 outline-none"
                    name="bulatanTombol"
                    type="number"
                    min="0"
                    placeholder={`Saat ini: ${
                      data.settings.bulatanTombol.toString() !== ""
                        ? data.settings.bulatanTombol
                        : "0 (siku)"
                    }`}
                    autoComplete="off"
                  />
                </div>
                <div className="px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400">
                  <label className="block px-1.5 text-sm text-black-default/75">
                    Warna Teks Tombol (Hex Color)
                  </label>
                  <input
                    className="w-full bg-transparent px-1.5 py-0.5 outline-none"
                    name="warnaTeksTombol"
                    placeholder="Ubah seluruh warna teks"
                    autoComplete="off"
                  />
                </div>
                <div className="px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400">
                  <label className="block px-1.5 text-sm text-black-default/75">
                    Warna Latar Tombol (Hex Color)
                  </label>
                  <input
                    className="w-full bg-transparent px-1.5 py-0.5 outline-none"
                    name="warnaLatarTombol"
                    placeholder="Ubah seluruh warna latar"
                    autoComplete="off"
                  />
                </div>
                <div className="px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400">
                  <label className="block px-1.5 text-sm text-black-default/75">
                    Backdrop Blur Tombol (Angka)
                  </label>
                  <input
                    className="w-full bg-transparent px-1.5 py-0.5 outline-none"
                    name="backdropBlurTombol"
                    type="number"
                    min="0"
                    placeholder={`Saat ini: ${
                      data.settings.backdropBlurTombol.toString() !== ""
                        ? data.settings.backdropBlurTombol
                        : "0 (mati)"
                    }`}
                    autoComplete="off"
                  />
                </div>
              </div>
              <button
                className="w-fit ml-auto px-7 py-1.5 bg-green-default rounded-full text-white-light"
                type="submit"
              >
                Simpan
              </button>
            </form>
          </div>
          <div className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px] outline outline-2 outline-white-light">
            <h2 className="mb-3 font-[Gotham] text-lg md:text-xl">
              Buat Tautan LinkTree
            </h2>
            <form className="flex flex-col gap-4" onSubmit={submitLinkHandler}>
              <div
                className={`px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400 ${
                  notFilled.judulTautan ? "!border-red-default" : ""
                }`}
              >
                <label className="block px-1.5 text-sm text-black-default/75">
                  Nama Tautan <span className="text-red-default">*</span>
                </label>
                <input
                  className="w-full bg-transparent px-1.5 py-0.5 outline-none"
                  name="judulTautan"
                  onChange={() => {
                    if (notFilled.judulTautan) {
                      setNotFilled((prevData) => {
                        return { ...prevData, judulTautan: false };
                      });
                    }
                  }}
                  placeholder="Masukkan nama tautan"
                  autoComplete="off"
                />
              </div>
              <div
                className={`px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400 ${
                  notFilled.tautanPanjang ? "!border-red-default" : ""
                }`}
              >
                <label className="block px-1.5 text-sm text-black-default/75">
                  Tautan Panjang <span className="text-red-default">*</span>
                </label>
                <input
                  className="w-full bg-transparent px-1.5 py-0.5 outline-none"
                  name="tautanPanjang"
                  onChange={() => {
                    if (notFilled.tautanPanjang) {
                      setNotFilled((prevData) => {
                        return { ...prevData, tautanPanjang: false };
                      });
                    }
                  }}
                  placeholder="Masukkan tautan panjang"
                  autoComplete="off"
                />
              </div>
              <div
                className={`px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400 ${
                  notFilled.tautanPendek ? "!border-red-default" : ""
                }`}
              >
                <label className="block px-1.5 text-sm text-black-default/75">
                  Tautan Pendek <span className="text-red-default">*</span>
                </label>
                <div className="flex px-1.5 py-0.5">
                  <span>link.technocorner.id/</span>
                  <input
                    className="w-full bg-transparent outline-none"
                    name="tautanPendek"
                    onChange={() => {
                      if (notFilled.tautanPendek) {
                        setNotFilled((prevData) => {
                          return { ...prevData, tautanPendek: false };
                        });
                      }
                    }}
                    placeholder="Masukkan tautan pendek"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div>
                <div className="flex flex-wrap gap-2">
                  <div className="px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400">
                    <label className="block px-1.5 text-sm text-black-default/75">
                      Warna Teks (Hex Color)
                    </label>
                    <input
                      className="w-full bg-transparent px-1.5 py-0.5 outline-none"
                      name="warnaTeks"
                      placeholder="Bawaan: #FFFFFF (putih)"
                      autoComplete="off"
                    />
                  </div>
                  <div className="px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400">
                    <label className="block px-1.5 text-sm text-black-default/75">
                      Warna Latar Belakang (Hex Color)
                    </label>
                    <input
                      className="w-full bg-transparent px-1.5 py-0.5 outline-none"
                      name="warnaLatar"
                      placeholder="Bawaan: #000000 (hitam)"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
              <button
                className="w-fit ml-auto px-7 py-1.5 bg-green-default rounded-full text-white-light"
                type="submit"
              >
                Simpan
              </button>
            </form>
          </div>
          <div className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px] outline outline-2 outline-white-light">
            <h2 className="mb-3 font-[Gotham] text-lg md:text-xl">
              Daftar Tautan LinkTree
            </h2>
            {!data.links ||
              (!data.links.length && (
                <p className="text-center">Tidak ada data</p>
              ))}
            {data.links && data.links.length > 0 && (
              <div className="space-y-3">
                {data.links.map((d, index) => (
                  <div
                    className="flex p-3.5 text-left border border-black-lighter rounded-xl"
                    key={d.tautanPendek}
                  >
                    <div className="flex-grow min-w-0">
                      <a
                        className="block min-w-0 font-bold hover:underline truncate"
                        href={`${link}/${d.tautanPendek}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        title={d.judul}
                      >
                        {d.judul}
                      </a>
                      <p
                        className="min-w-0 truncate"
                        title={`${link}/${d.tautanPendek}`}
                      >
                        {`${link}/${d.tautanPendek}`}
                      </p>
                      <p className="min-w-0 truncate" title={d.tautanPanjang}>
                        {d.tautanPanjang}
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-between ml-2">
                      <button
                        className={`material-icons-outlined ${
                          index === 0
                            ? "text-black-lighter"
                            : "hover:text-blue-light"
                        }`}
                        onClick={() =>
                          index !== 0 && changeLinkOrder(index, "UP")
                        }
                        title="Pindah ke atas"
                      >
                        keyboard_arrow_up
                      </button>
                      <button
                        className={`material-icons-outlined ${
                          index === data.links.length - 1
                            ? "text-black-lighter"
                            : "hover:text-blue-light"
                        }`}
                        onClick={() =>
                          index !== data.links.length - 1 &&
                          changeLinkOrder(index, "DOWN")
                        }
                        title="Pindah ke bawah"
                      >
                        keyboard_arrow_down
                      </button>
                      <button
                        className="block hover:text-red-400 material-icons-outlined"
                        onClick={() => deleteLink(d.tautanPendek)}
                        title="Hapus tautan"
                      >
                        delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="hidden sm:block flex-none w-1/4 sm:max-w-[260px] lg:max-w-[300px] xl:max-w-[390px]">
          <iframe
            className="sticky top-8 w-full aspect-[9/18] border-4 border-black-default rounded-3xl"
            key={forceRender}
            src={link}
            title="LinkTree Technocorner"
          />
        </div>
      </div>
    </>
  );
}
