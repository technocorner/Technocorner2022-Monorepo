export default [
  // Column #1
  {
    column: "No",
    type: Number,
    width: "4",
    wrap: true,
    value: (data: { no: number }) => data.no,
  },
  // Column #2
  {
    column: "Nama Tim",
    type: String,
    width: "25",
    wrap: true,
    value: (data: { namaTim: string }) => data.namaTim,
  },
  // Column #3
  {
    column: "Asal Instansi",
    type: String,
    width: "35",
    wrap: true,
    value: (data: { asalInstansi: string }) => data.asalInstansi,
  },
  // Column #4
  {
    column: "Pembayaran",
    type: String,
    width: "35",
    wrap: false,
    value: (data: { pembayaran: string }) => data.pembayaran,
  },
  {
    column: "Nama Ketua",
    type: String,
    width: "35",
    wrap: true,
    value: (data: { nama0: string }) => data.nama0,
  },
  {
    column: "Email Ketua",
    type: String,
    width: "35",
    wrap: true,
    value: (data: { email0: string }) => data.email0,
  },
  {
    column: "WA Ketua",
    type: String,
    width: "15",
    wrap: true,
    value: (data: { whatsapp0: string }) => data.whatsapp0,
  },
  {
    column: "Nama Anggota",
    type: String,
    width: "35",
    wrap: true,
    value: (data: { nama1: string }) => data.nama1,
  },
  {
    column: "Email Anggota",
    type: String,
    width: "35",
    wrap: true,
    value: (data: { email1: string }) => data.email1,
  },
  {
    column: "WA Anggota",
    type: String,
    width: "15",
    wrap: true,
    value: (data: { whatsapp1: string }) => data.whatsapp1,
  },
  {
    column: "Nama Anggota",
    type: String,
    width: "35",
    wrap: true,
    value: (data: { nama2: string }) => data.nama2,
  },
  {
    column: "Email Anggota",
    type: String,
    width: "35",
    wrap: true,
    value: (data: { email2: string }) => data.email2,
  },
  {
    column: "WA Anggota",
    type: String,
    width: "15",
    wrap: true,
    value: (data: { whatsapp2: string }) => data.whatsapp2,
  },
  {
    column: "Verifikasi Pendaftaran",
    type: Boolean,
    width: "15",
    wrap: true,
    value: (data: { verifikasi: boolean }) => data.verifikasi,
  },
  {
    column: "Ceklis Email Konfirmasi",
    type: Boolean,
    width: "15",
    wrap: true,
    value: (data: { verifikasiEmailTerkirim: boolean }) =>
      data.verifikasiEmailTerkirim,
  },
] as any;
