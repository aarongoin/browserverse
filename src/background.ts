import { getCurrentTab, CurrentTab } from "./api";

// CurrentTab:
// id: number;
// window_id: number;
// opener_tab_id?: number;
// active: boolean;
// hidden: boolean;
// incognito: boolean;
// title: string;
// url: string;
// favicon_url: string;

/*

Might be easier to listen for tab events, and use these to handle navigation logic. Can still use interval pinging to determine time spent?
onCreated (when tab is created) -- guaranteed to be new url, but may not get url until a later onUpdated
onUpdated (when a tab is updated)
onRemoved (when a tab is closed)
onReplaced (not entirely sure, but MDN says when tab is replaced dues to prerendering or instant?)

navigation::domain::path -> all navigation records from domain::path to any other domain::path (or same domain with different path)

domain

Will want to query domain along with all urls

[domain]::meta -> domain meta info and stats
[domain]::navigation -> inter-domain navigation record
[domain]::[path] -> individual domain paths records
[domain]::[path]:nav -> domain

[domain::path: string]: {
  [domain::path: string]: number;
},
[domain: string] : {
  meta: [number, number, string, boolean];
  paths: {
    [path: string]: [number, number, string, boolean];
  };
}

time: Array<[domain: string, time: number]>;

get time array
chunk time array and get 

*/

interface PathRecord {
  title: string;
  incognito: boolean; // true if all visits to this url have been incognito, else false
  time: number; // total time spent in this url
  visits: number; // number of separate visits to this url
}
type PathStore = [number, number, string, boolean];

interface DomainStore {
  favicon_url: string;
  incognito: boolean;
  time: number; // total time spent in this domain
  visits: number; // number of separate visits to urls in this domain
  paths: Record<string, PathRecord>;
}

interface DomainRecord {
  favicon_url: string;
  incognito: boolean; // true if all visits to this url have been incognito, else false
  time: number; // total time spent in this domain
  visits: number; // number of separate visits to urls in this domain
}
type CompressedDomainRecord = [string, string, boolean, number, number];

interface UrlRecord {
  title: string;
  incognito: boolean; // true if all visits to this url have been incognito, else false
  time: number; // total time spent in this url
  visits: number; // number of separate visits to this url
}
type CompressedUrlRecord = [string, string, string, boolean, number, number];

interface Place {
  domain: string;
  path: string;
}

type DomainCache = Record<
  string,
  DomainRecord & { urls: Record<string, UrlRecord> }
>;
type TabCache = Record<number, Place>; // tab_id: Place

interface NavigationRecord {
  from: Place;
  to: Place;
  times: number; // count of times navigated along this route
}
type CompressedNavigationRecord = [string, string, string, string, number];

const getPlaceFromUrl = (url: string): Place => {
  const parsed = new URL(url);
  return {
    domain: parsed.name,
    path: parsed.pathname,
  };
};

const getUrlFromPlace = (place: Place): string =>
  `${place.domain}/${place.path}`;

const urlRecordFromTab = (tab: CurrentTab, time = 0): UrlRecord => {
  const parsed = new URL(tab.url);
  return {
    title: tab.title,
    url: tab.url.replace(parsed.hash, "").replace(parsed.search, ""),
    incognito: tab.incognito,
    visits: 1,
    time,
  };
};

const domainRecordFromTab = (tab: CurrentTab, time = 0): DomainRecord => ({
  favicon_url: tab.favicon_url,
  incognito: tab.incognito,
  visits: 1,
  time: time,
});

const timeArray: Array<string> = [];
const domainCache: DomainCache = {};
const tabCache: TabCache = {};

function sortTimeArray() {
  timeArray.sort((a: string, b: string) => domainCache[a].time - domainCache[b].time);
}

const TIMEOUT = 250;
let previous = Date.now();

let currentTab = { id: Number.NaN };
let currentUrl = { domain: "NOT REAL" };
// store current place
let domain = "";
let path = "";

async function recordCurrentTab() {
  const tab = await getCurrentTab();
  if (!tab) return;
  const now = Date.now();
  const dt = now - previous;
  previous = now;
  const place = getPlaceFromUrl(tab.url);

  let pathDidChange = false;
  let domainDidChange = false;

  if (tab.id !== currentTab.id) {
    if (tab.opener_tab_id) {
      if (tab.opener_tab_id === currentTab.id) {
      } else {
        // TODO: reverse lookup of tab id to place
        const from = tabCache[tab.opener_tab_id];
        if (from) {
          
          // TODO: make navigation record
          const navRecord: NavigationRecord = {
            from,
            to: place,
            times: 1,
          };
        }
      }
    }
  } else if (place.domain !== domain) {
    domainDidChange = true;
  } else if (place.path !== path) {
    pathDidChange = true;
  }

  // check tab id
  // check url
  // check domain
  // if tab id is the same, but domain and/or path has changed, then create a navigation record
  // if the opener_tab_id exists, then cross-reference to find referrer domain and path, then create a navigation record
  //
  // mark this history item
  // add `dt` to the time spent on that url
  // if this is new tab, use openerTabId if possible to trace referrer url
  // TODO: investigate if openerTabId can be self or not or just check for same tab id but different url
}

setInterval(recordCurrentTab, 250);
