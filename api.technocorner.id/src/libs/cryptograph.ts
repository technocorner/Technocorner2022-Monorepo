import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

export function encrypt(plain: string) {
  const key = randomBytes(24).toString("base64url"); // length: 32;
  const iv = randomBytes(9).toString("base64url"); // length: 12

  const cipher = createCipheriv("aes-256-gcm", key, iv);
  let encrypted = cipher.update(plain, "utf8", "base64url");
  encrypted += cipher.final("base64url");

  return {
    encrypted,
    decryptor: key + cipher.getAuthTag().toString("base64url") + iv,
  };
}

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
