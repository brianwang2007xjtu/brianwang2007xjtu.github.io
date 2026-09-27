import { createCipheriv, pbkdf2Sync, randomBytes } from "node:crypto";

/** PBKDF2 rounds used when turning a password into an AES key. */
export const PBKDF2_ITERATIONS = 210_000;

/**
 * Encrypts the rendered post HTML for the browser.
 *
 * The returned JSON is safe to inline in a page: it holds the salt, the IV, the
 * GCM tag and the ciphertext — never the password. Because AES-GCM is
 * authenticated, a wrong password simply fails to decrypt, so there is no
 * password hash to attack either.
 */
export function encryptForClient(html: string, password: string): string {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 32, "sha256");

  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(html, "utf8"),
    cipher.final(),
  ]);

  return JSON.stringify({
    v: 1,
    it: PBKDF2_ITERATIONS,
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    ct: ciphertext.toString("base64"),
  });
}
