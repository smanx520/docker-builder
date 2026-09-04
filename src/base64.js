// Base64 编解码（避免使用 Buffer，兼容 Cloudflare Workers 运行时）
export function encodeBase64(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }
  return btoa(bin);
}

export function decodeBase64(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

// 对 UTF-8 字符串做 base64（用于 workflow 文件内容上传）
export function encodeBase64Utf8(str) {
  return encodeBase64(new TextEncoder().encode(str));
}
