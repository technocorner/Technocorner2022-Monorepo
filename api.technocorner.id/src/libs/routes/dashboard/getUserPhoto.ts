import getFirestoreUrl from "../../firebase/getFirestoreUrl";
import getProxiedUrl from "../../getProxiedUrl";

export default async (photo: string) => {
  if (
    !(
      photo.includes("technocorner.id") ||
      photo.includes("localhost") ||
      photo.includes("googleusercontent.com")
    )
  ) {
    return await getFirestoreUrl("pengguna/foto/" + photo);
  }
  return getProxiedUrl(photo);
};
