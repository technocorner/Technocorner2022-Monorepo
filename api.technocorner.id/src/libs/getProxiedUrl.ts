import { server } from "../data/server";
import { encrypt } from "./cryptograph";

export default function (plainUrl: string) {
  const encryptedUrl = encrypt(plainUrl);
  return `${server}/proxy/${encryptedUrl.decryptor + encryptedUrl.encrypted}`;
}
