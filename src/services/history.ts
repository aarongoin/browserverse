// import "chrome-types";
import _memoize from "lodash-es/memoize";
import clamp from "../utils/clamp";

export type DomainUrl = {
  url: string;
  pathname: string;
  subdomain: string;
  title: string;
  visits: number; // raw number of recorded "visits" to this url (includes things most users would not consider visits)
  days: number; // number of days we've recieved this url for (set in each query and summed at end for rough estimate of how many days this url was visited)
};
export type DomainItem = {
  name: string;
  domain: string;
  tld: string;
  last_visited: number;
  history: DomainUrl[];
  visits: number;
  days: number;
  visit_days: number; // the aggregated visits/day -- very likely to be different from taking sum(visits) / days
  x: number;
  y: number;
  d: number;
  color: string;
};
export type DomainItems = Record<string, DomainItem>;

const starColorGradient = [
  [255, 36, 0], // 0%
  [255, 242, 80], // 40%
  [255, 255, 222], // 50%
  [222, 255, 255], // 51%
  [133, 241, 255], // 66%
  [33, 129, 255], // 100%
];
const perfectMatch = [0, 0.4, 0.5, 0.51, 0.66, 1];
function colorForStar(ratio: number): string {
  ratio = clamp(ratio, 0, 1);
  // interpolate between the two closest color stops to produce a final color
  const bottom_index = perfectMatch.findIndex(
    (p, i) =>
      p <= ratio &&
      (i === starColorGradient.length - 1 || perfectMatch[i + 1] > ratio)
  );
  const bottom_color = starColorGradient[bottom_index];
  const top_index = clamp(bottom_index + 1, 0, starColorGradient.length - 1);
  const top_color = starColorGradient[top_index];
  // scale the ratio to the space between these color stops
  const r =
    (ratio - perfectMatch[bottom_index]) /
    (perfectMatch[top_index] - perfectMatch[bottom_index]);
  const color = bottom_color.map((bc, c) => {
    return Math.trunc(bc + (top_color[c] - bc) * r);
  });
  return `#${color
    .map((v) => (v >= 16 ? v.toString(16) : `0${v.toString(16)}`))
    .join("")}`;
}

const armFns: Array<[(theta: number) => number, [number, number]]> = [
  [
    (theta) => 0.1 * Math.E ** (0.24 * theta),
    [0.5, 10.288715940506573],
  ],
  [
    (theta) => -0.1 * Math.E ** (0.24 * theta),
    [0.5, 10.288715940506573],
  ],
  [
    (theta) => -0.33 * Math.E ** (0.22 * theta),
    [0.614159265358979, 6.754424205218055],
  ],
  [
    (theta) => 0.33 * Math.E ** (0.22 * theta),
    [-0.5, 6.754424205218055],
  ],
  // dupe fns, with different ranges
  [
    (theta) => 0.1 * Math.E ** (0.24 * theta),
    [3, 10.288715940506573],
  ],
  [
    (theta) => -0.1 * Math.E ** (0.24 * theta),
    [4, 10.288715940506573],
  ],
  [
    (theta) => -0.33 * Math.E ** (0.22 * theta),
    [4, 6.754424205218055],
  ],
  [
    (theta) => 0.33 * Math.E ** (0.22 * theta),
    [4, 6.754424205218055],
  ],
];

const MaxUint = 4_294_967_295;
const OneDayInMs = 86_400_000;
const FourtyFiveDegreesInRads = 0.785398163397449;
const encoder = new TextEncoder();

const positionDomain = _memoize(
  async (name: string): Promise<[number, number, string]> => {
    // hashing the domains to produce deterministic "ratioom" numbers
    // then taking those numbers to generate position of the domain
    const hash = await crypto.subtle.digest("SHA-1", encoder.encode(name));
    // SHA-1 hash produces 160 bit digest which we can evenly divide into 5 integers
    const vals = new Uint32Array(hash);
    // use the first number for picking the arm function
    const arm = Math.abs(vals[0] % 8);
    const [armFn, [start, end]] = armFns[arm];
    // use the second number for picking a value for theta within the arm function
    let theta = (end - start) * (vals[1] / MaxUint) + start;
    // use the third number to shift radius
    // calculate radius and use third number to shift radius inwards (pulling point off the function line just a little for visuals)
    const r = armFn(theta) - (vals[2] / MaxUint) * 0.1;
    // use the fourth number to adjust theta
    theta -= (vals[3] / MaxUint) * FourtyFiveDegreesInRads;
    // use fifth number for star color
    const color = colorForStar(vals[4] / MaxUint);
    return [
      // convert radius and theta (polar coords!) into cartesian coords
      clamp(r * Math.cos(theta) * 0.84, -1.5, 1.5),
      clamp(r * Math.sin(theta) * 0.84),
      color,
    ];
  }
);

// pulls out subdomain, domain, top-level-domain, and pathname
const parseUrl = /^https?:\/\/(?:([^/]*?)\.)?(\w+)\.(\w+|co\.(?:uk|nz))(?::\d*)?\/(.*)$/i;

export function getFullHistoryBetween(start_time: number, end_time: number) {
  const days = Math.max(4, Math.abs(end_time - start_time));
  return new Promise(async (resolve) =>
    chrome.history.search(
      {
        text: "",
        startTime: Date.now() - OneDayInMs * start_time,
        endTime: Date.now() - OneDayInMs * end_time,
        maxResults: 2_147_483_647,
      },
      (history) => {
        /*
        History returned is any visits to a url within the timespan.
        But the visit count returned for any single url is ALL VISITS in recorded history.
        */
        let results: DomainItems = {};
        for (const h of history) {
          if (!h.url) continue;
          const match = h.url.match(parseUrl);
          if (!match) continue;
          const [, subdomain, domain, tld, pathname] = match;
          if (!domain || !tld) continue;
          const key = `${domain}.${tld}`;
          if (!results[key])
            results[key] = {
              name: key,
              domain,
              tld,
              last_visited: h.lastVisitTime,
              history: [],
              x: 0,
              y: 0,
              visits: 0,
              days,
              visit_days: 0,
              d: 2,
              color: "#ff2400",
            };
          const visits = h.visitCount || h.typedCount || 1;
          results[key].history.push({
            url: h.url,
            pathname,
            subdomain,
            visits,
            title: h.title || "",
            days,
          });
          results[key].visits += visits;
          results[key].visit_days = clamp(visits / days, 0, days);
        }
        const names = Object.keys(results);
        names.sort();
        const hosts = names.length;
        Promise.all(names.map((h) => positionDomain(h))).then((positions) => {
          for (const i in names) {
            const r = results[names[i]];
            r.x = positions[i][0];
            r.y = positions[i][1];
            r.color = positions[i][2];
          }
          results["browserverse.cloud"] = {
            last_visited: 0,
            visits: 0,
            days,
            visit_days: days,
            history: [],
            ...results["browserverse.cloud"],
            name: "browserverse.cloud",
            domain: "browserverse",
            tld: "cloud",
            x: 0,
            y: -0.05,
            d: 16,
            color: "#ffffff",
          };
          resolve({
            history: results,
            hosts,
            names,
            max_results: 2_147_483_647, // we return this so we know if we ever max out and need to get the "next" page
            start_time,
            end_time,
            days,
          });
        });
      }
    )
  );
}

export function mergeDomainItems(
  a: DomainItems,
  b: DomainItems,
  days: number
): DomainItems {
  const result: DomainItems = { ...a };
  for (const d in b) {
    if (!result[d]) {
      result[d] = b[d];
    } else {
      const item_days = result[d].days + b[d].days;
      let visits = result[d].visits;
      const history = result[d].history;
      // merge history
      for (const h of b[d].history) {
        const i = history.findIndex((_h) => h.url === _h.url);
        if (i === -1) {
          history.push(h);
          visits += h.visits;
        } else {
          history[i].days += h.days;
        }
      }

      // sort history by visit count first, then alphabetically
      history.sort((a, b) =>
        a.visits > b.visits
          ? -1
          : a.visits < b.visits
          ? 1
          : a.pathname < b.pathname
          ? -1
          : a.pathname > b.pathname
          ? 1
          : 0
      );

      result[d] = {
        ...result[d],
        ...b[d],
        last_visited: Math.max(b[d].last_visited, result[d].last_visited),
        history,
        visits,
        visit_days: clamp(visits / item_days, 0, item_days),
        days: item_days,
      };
    }
  }
  return result;
}
