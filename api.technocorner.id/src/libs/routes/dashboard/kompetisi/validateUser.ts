export default (
  data: {
    foto: string;
    status: string;
    instansi: string;
    identitas: string;
    whatsapp: string;
    acara: Array<{ id: string; kategori: string }>;
  },
  acara: string
) => {
  const notFilled = [];
  let failed = false;
  if (
    !data.foto ||
    data.foto.includes("localhost") ||
    data.foto.includes("technocorner.id")
  ) {
    notFilled.push("foto");
    failed = true;
  }
  if (!data.status) {
    notFilled.push("status");
    failed = true;
  }
  if (!data.instansi) {
    notFilled.push("asal instansi");
    failed = true;
  }
  if (!data.identitas) {
    notFilled.push("identitas");
    failed = true;
  }
  if (!data.whatsapp) {
    notFilled.push("whatsapp");
    failed = true;
  }
  if (failed) {
    return {
      success: false,
      body: { error: `Pengguna belum mengisi ${notFilled.join(", ")}` },
    };
  }

  if (
    (data.acara as Array<{ id: string; kategori: string }>).find(
      (a) => a.kategori === acara
    )
  ) {
    return {
      success: false,
      body: {
        error: "Akun sudah terdaftar pada kategori kegiatan yang sama",
      },
    };
  }

  return { success: true };
};
