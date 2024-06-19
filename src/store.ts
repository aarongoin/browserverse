import { store } from "./api";

export function getDomainStats(domain: string) {
  const key = `${domain}::stats`;
  return store.get({
    [key]: {
      favicon_url: "",
      incognito: false,
      time: 0,
      visits: 0,
    },
  }).then((res) => res[key]);
}

export function getDomainPaths(domain: string) {
  const key = `${domain}::paths`;
  return store.get({
    [key]: {},
  }).then((res) => res[key]);
}

export function getDomain
