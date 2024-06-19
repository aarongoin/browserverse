import clamp from "./clamp";

type Bounds = [number, number, number, number];

export function QuadTree(bounds: Bounds, bucket_size: number) {
  const [x0, y0, x1, y1] = bounds;
  const buckets: string[][][] = [];
  let xm = Math.ceil((x1 - x0) / bucket_size);
  let ym = Math.ceil((y1 - y0) / bucket_size);
  for (let i = 0; i < xm; i++) {
    buckets[i] = [];
    for (let j = 0; j < ym; j++) {
      buckets[i][j] = [];
    }
  }

  return {
    bounds,
    buckets,
    add(x: number, y: number, d: string) {
      if (x < x0 || x >= x1 || y < y0 || y >= y1) console.log(x, y, d);
      const i = clamp(Math.floor((x - x0) / bucket_size), 0, xm);
      const j = clamp(Math.floor((y - y0) / bucket_size), 0, ym);
      buckets[i][j].push(d);
    },
    getDataInBounds(x0: number, y0: number, x1: number, y1: number) {
      const i0 =
        x0 < bounds[0] ? 0 : Math.floor((x0 - bounds[0]) / bucket_size);
      const j0 =
        y0 < bounds[1] ? 0 : Math.floor((y0 - bounds[1]) / bucket_size);
      const i1 =
        x1 > bounds[2] ? xm : Math.ceil((x1 - bounds[0]) / bucket_size);
      const j1 =
        y1 > bounds[3] ? ym : Math.ceil((y1 - bounds[1]) / bucket_size);
      let results: string[] = [];
      for (let i = i0; i < i1; i++) {
        for (let j = j0; j < j1; j++) {
          results = results.concat(buckets[i][j]);
        }
      }
      return results;
    },
  };
}
