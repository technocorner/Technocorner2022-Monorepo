export default (date: Date) => {
  const tanggal = `${date.getDate()} ${
    [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ][date.getMonth()]
  } ${date.getFullYear()}`;
  const jam = date.getHours();
  const menit = date.getMinutes();
  const pukul = `${jam < 10 ? "0" + jam : jam}:${
    menit < 10 ? "0" + menit : menit
  }`;

  return { tanggal, pukul };
};
