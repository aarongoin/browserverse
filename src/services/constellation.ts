// import "chrome-types";
import { weekdayMonthDayYear } from "../components/Sidepanel/FocusedStarPanel";
import clamp from "../utils/clamp";
import { DomainItems } from "./history";

type ConstellationStar = {
  color: string;
  name: string;
  x: number;
  y: number;
  d: number;
};

export type ConstellationData = {
  date: number; // time of creation
  name: string;
  stars: ConstellationStar[];
};

export function getConstellations(): Promise<
  Record<string, ConstellationData>
> {
  return new Promise((r) =>
    chrome.storage.local.get({ constellations: "{}" }, r)
  ).then(({ constellations }) =>
    constellations ? JSON.parse(constellations) : {}
  );
}

export function saveConstellation(constellation: ConstellationData) {
  return getConstellations().then((constellations) => {
    if (!constellations[constellation.date]) {
      constellations[constellation.date] = constellation;
    } else {
      if (constellation.name) {
        constellations[constellation.date].name = constellation.name;
      }
      constellations[constellation.date].stars = constellation.stars;
    }
    return chrome.storage.local.set({
      constellations: JSON.stringify(constellations),
    });
  });
}
const OneDayInMs = 86_400_000;
export function trimConstellations() {
  const oldest_date = Date.now() - OneDayInMs * 30;
  return getConstellations().then((constellations) => {
    const delete_dates = Array.from(
      Object.values(constellations).filter(
        (c) => c.date > 0 && c.date < oldest_date
      )
    ).map((c) => c.date);
    for (const d of delete_dates) {
      delete constellations[d];
    }
    return chrome.storage.local.set({
      constellations: JSON.stringify(constellations),
    });
  });
}

export function createConstellation(
  names: string[],
  items: DomainItems,
  long = true
): Promise<unknown> {
  const eligible = names.filter((h) => h !== "browserverse.cloud");
  if (!long)
    eligible.sort((a, b) =>
      items[a].history.length > items[b].history.length ? -1 : 1
    );
  const domains = ["browserverse.cloud"].concat(eligible.slice(0, 11));
  const date = long ? 0 : Date.parse(weekdayMonthDayYear(new Date()));
  const constellation = {
    name: long ? "Your Super Constellation" : "",
    date,
    stars: domains.map((h) => {
      let { x, y, color, visit_days, history } = items[h];
      return {
        color,
        name: h,
        x,
        y,
        d:
          h !== "browserverse.cloud"
            ? clamp(3 * (long ? visit_days : history.length / 2), 2, 16)
            : 16,
      };
    }),
  };

  return saveConstellation(constellation);
}

export function renameConstellation(date: number, name: string) {
  return getConstellations().then((constellations) => {
    if (constellations[date] && constellations[date].name !== name) {
      constellations[date].name = name;
      return Promise.resolve(
        chrome.storage.local.set({
          constellations: JSON.stringify(constellations),
        })
      ).then(getConstellations);
    }
    return constellations;
  });
}

function packNumber(n: number): string {
  return (n.toFixed(5) * 1000000).toString(36);
}

function unpackNumber(x: string): number {
  return parseInt(x, 36) / 1000000;
}

export function packConstellation(constellation: ConstellationData) {
  return `${
    constellation.name ? `n=${encodeURIComponent(constellation.name)}&` : ""
  }d=${constellation.date.toString(36)}&s=${btoa(
    constellation.stars
      .map((s) =>
        [
          s.name,
          s.color.slice(1),
          s.d.toString(36),
          packNumber(s.x),
          packNumber(s.y),
        ].join("|")
      )
      .join("|")
  )}`;
}
