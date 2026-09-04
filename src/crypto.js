import nacl from 'tweetnacl';
import { decodeBase64, encodeBase64 } from './base64.js';

// 使用 libsodium 兼容的 crypto_box_seal（封箱）加密 GitHub Actions secret。
// 构造：随机临时密钥对 + XSalsa20-Poly1305，输出 = 临时公钥(32) + nonce(24) + 密文。
// 与 GitHub secrets API 的 public-key 加密方式一致。
export function sealSecret(publicKeyBase64, value) {
  const publicKey = decodeBase64(publicKeyBase64);
  const message = new TextEncoder().encode(value);

  const ephemeral = nacl.box.keyPair();
  const nonce = nacl.randomBytes(nacl.box.nonceLength); // 24
  const sharedKey = nacl.box.before(publicKey, ephemeral.secretKey);
  const cipher = nacl.box.after(message, nonce, sharedKey);

  const sealed = new Uint8Array(32 + 24 + cipher.length);
  sealed.set(ephemeral.publicKey, 0);
  sealed.set(nonce, 32);
  sealed.set(cipher, 32 + 24);
  return encodeBase64(sealed);
}
