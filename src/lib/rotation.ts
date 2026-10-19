/**
 * Rotación determinista entre -max y +max grados a partir de un id.
 * Sin Math.random: el mismo id da el mismo ángulo en servidor y cliente.
 */
export function rotationFromId(id: string, max = 4): number {
  let hash = 2166136261;
  for (let i = 0; i < id.length; i++) {
    hash ^= id.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const unit = (hash >>> 0) / 4294967295; // 0..1
  return Math.round((unit * 2 - 1) * max * 10) / 10;
}
