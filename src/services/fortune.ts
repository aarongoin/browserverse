// import "chrome-types";
import { weekdayMonthDayYear } from "../components/Sidepanel/FocusedStarPanel";

type BrowserverseFortune = {
  sign: string;
  fortune: string;
};

export type TimestampedBrowserverseFortune = BrowserverseFortune & {
  date: number;
};

async function getBrowserverseFortune(
  locations: string[]
): Promise<BrowserverseFortune> {
  const res = await fetch(
    "https://nurdzhfpondbwoqtyiyf.supabase.co/functions/v1/generate",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer pwkey_2z1272333v4u516r166p4n64565d006i16",
      },
      mode: "cors",
      body: JSON.stringify({
        prompt_id: "9422ce3c-f139-4b21-bba7-d3085f4f6f94",
        inputs: {
          current_date: new Date().toISOString(),
          user_locations: locations.join(", "),
        },
      }),
    }
  );

  if (res.ok) {
    const results = await res.json();
    return results.outputs[0].content as BrowserverseFortune;
  } else {
    const { error } = await res.json();
    throw error;
  }
}

export function saveFortune(fortune: TimestampedBrowserverseFortune) {
  return chrome.storage.local.set({
    fortune: JSON.stringify(fortune),
  });
}

export function getCachedFortune(
  date: number
): Promise<TimestampedBrowserverseFortune | null> {
  return new Promise((r) => chrome.storage.local.get({ fortune: "null" }, r))
    .then(({ fortune }) =>
      fortune ? (JSON.parse(fortune) as TimestampedBrowserverseFortune) : null
    )
    .then((fortune) => (fortune?.date === date ? fortune : null));
}

export async function getDailyBrowserverseFortune(
  locations: string[]
): Promise<TimestampedBrowserverseFortune> {
  const date = Date.parse(weekdayMonthDayYear(new Date()));
  // Try to get today's fortune from storage
  let fortune = await getCachedFortune(date);
  if (fortune) return fortune;
  // Otherwise hit up the GPTs for dat sweet fortune
  fortune = { ...(await getBrowserverseFortune(locations)), date };
  saveFortune(fortune);
  return fortune;
}
