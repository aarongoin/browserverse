let search: typeof browser.history.search = browser.history.search;
let getVisits: typeof browser.history.getVisits = browser.history.getVisits;
let getCurrent: typeof browser.tabs.getCurrent = browser.tabs.getCurrent;
let getValues: typeof browser.storage.local.get = browser.storage.local.get;
let setValues: typeof browser.storage.local.set = browser.storage.local.set;
let NoneTabId: number = browser.tabs.TAB_ID_NONE;

type Query = {
  text: string;
  startTime?: string | number | Date | undefined;
  endTime?: string | number | Date | undefined;
  maxResults?: number | undefined;
};

// @ts-expect-error
if (!search && typeof chrome !== "undefined") {
  search = (query: Query) =>
    // @ts-expect-error
    new Promise((resolve) => chrome.history.search(query, resolve));

  getVisits = (details: { url: string }) =>
    // @ts-expect-error
    new Promise((resolve) => chrome.history.getVisits(details, resolve));

  // @ts-expect-error
  getCurrent = () => new Promise((resolve) => chrome.tabs.getCurrent(resolve));

  // @ts-expect-error
  NoneTabId = chrome.tabs.TAB_ID_NONE;

  // @ts-expect-error
  getValues = (keys: string[]) =>
    // @ts-expect-error
    new Promise((resolve) => chrome.storage.local.get(keys, resolve));

  setValues = (values: Record<string, any>) =>
    // @ts-expect-error
    new Promise((resolve) => chrome.storage.local.set(values, resolve));
}

export interface HistoryItem {
  id: string;
  url: string;
  title: string;
  visits: browser.history.VisitItem[];
}

export async function getHistory(
  startTime = 0,
  text = ""
): Promise<HistoryItem[]> {
  return search({ text, startTime }).then(async (results) => {
    const historyItems = results.filter((item) => !!item.url) as Array<
      Omit<browser.history.HistoryItem, "url"> & { url: string }
    >;
    const result = [];
    for (const item of historyItems) {
      const visits = await getVisits({ url: item.url });
      result.push({
        id: item.id,
        url: item.url,
        title: item.title as string, // TODO: double check that title always exists here!
        visits,
      });
    }
    return result;
  });
}

export interface CurrentTab {
  id: number;
  window_id: number;
  opener_tab_id?: number;
  active: boolean;
  hidden: boolean;
  incognito: boolean;
  title: string;
  url: string;
  favicon_url: string;
}

export async function getCurrentTab(): Promise<CurrentTab | null> {
  const tab = await getCurrent();
  if (
    !tab ||
    tab.status === "loading" ||
    !tab.favIconUrl ||
    tab.id === NoneTabId ||
    !tab.id ||
    !tab.url ||
    !tab.title
  )
    return null;
  return {
    id: tab.id,
    window_id: tab.windowId,
    opener_tab_id: tab.openerTabId,
    active: tab.active,
    hidden: tab.hidden,
    incognito: tab.incognito,
    title: tab.title,
    url: tab.url,
    favicon_url: tab.favIconUrl,
  };
}

export const store = {
  get: getValues,
  set: setValues,
};
