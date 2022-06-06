import getFirestoreUrl from "../../firebase/getFirestoreUrl";

export default async (identity: string) => {
  if (identity) {
    return await getFirestoreUrl("pengguna/identitas/" + identity);
  }
  return "";
};
