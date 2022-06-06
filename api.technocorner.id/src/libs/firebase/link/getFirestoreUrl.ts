import firebase from ".";
import getProxiedUrl from "../../getProxiedUrl";

export default async (path: string) => {
  const date = new Date();

  let day = date.getDate() + 2;
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  if (month === 2) {
    // Februari
    if (day > 28 && year % 400 !== 0) {
      // Biasa
      day -= 28;
      ++month;
    } else if (day > 29 && year % 400 === 0) {
      // Kabisat
      day -= 29;
      ++month;
    }
  } else if (month % 2 === 1 && day > 31) {
    // Bulan ganjil
    day -= 31;
    ++month;
  } else if (month % 2 === 0 && day > 30) {
    // Bulan genap selain februari
    day -= 30;
    ++month;
  } else if (month > 12) {
    month = 1;
    ++year;
  }

  const url = (
    await firebase
      .storage()
      .bucket()
      .file(path)
      .getSignedUrl({ action: "read", expires: `${month}-${day}-${year}` })
  )[0];

  return getProxiedUrl(url);
};
