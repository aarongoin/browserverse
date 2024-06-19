export default function clamp(x: number, min = -1, max = 1): number {
  return Math.max(min, Math.min(max, x));
}
