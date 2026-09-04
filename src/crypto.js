import nacl from 'tweetnacl';
import { decodeBase64, encodeBase64 } from './base64.js';
import { blake2b } from './blake2b.js';

// 使用 libsodium 兼容的 crypto_box_seal（封箱）加密 GitHub Actions secret。
// 构造：随机临时密钥对 + XSalsa20-Poly1305；
// nonce = BLAKE2b-24(临时公钥 ‖ 接收方公钥)，输出 = 临时公钥(32) + 密文(含 16 字节 Poly1305 标签)。
// 与 GitHub secrets API 要求的 tweetsodium / libsodium 格式完全一致。
export function sealSecret(publicKeyBase64, value) {
  const publicKey = decodeBase64(publicKeyBase64);
  const message = new TextEncoder().encode(value);

  const ephemeral = nacl.box.keyPair();
  // nonce = BLAKE2b-24(ephemeral_pk || recipient_pk)
  const nonceInput = new Uint8Array(nacl.box.publicKeyLength * 2);
  nonceInput.set(ephemeral.publicKey, 0);
  nonceInput.set(publicKey, nacl.box.publicKeyLength);
  const nonce = blake2b(nonceInput, nacl.box.nonceLength); // 24

  const cipher = nacl.box(message, nonce, publicKey, ephemeral.secretKey);

  const sealed = new Uint8Array(nacl.box.publicKeyLength + cipher.length);
  sealed.set(ephemeral.publicKey, 0);
  sealed.set(cipher, nacl.box.publicKeyLength);
  return encodeBase64(sealed);
}
