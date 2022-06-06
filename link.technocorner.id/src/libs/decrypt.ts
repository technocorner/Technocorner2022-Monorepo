import { createDecipheriv } from "crypto";

export function decrypt({
  encrypted,
  decryptor,
}: {
  encrypted: string;
  decryptor: string;
}) {
  const key = decryptor.substring(0, 32);
  const authTag = decryptor.substring(32, 54);
  const iv = decryptor.substring(54);

  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(Buffer.from(authTag, "base64url"));
  const decrypted = decipher.update(encrypted, "base64url", "utf8");

  return decrypted + decipher.final("utf8");
}
