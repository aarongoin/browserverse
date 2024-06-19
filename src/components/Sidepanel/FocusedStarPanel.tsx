import { h } from "preact";
import { useEffect } from "preact/hooks";
import { Star } from "../Star";
import { CloseButton } from "./CloseButton";
import { FocusedStarHistoryItem } from "./FocusedStarHistoryItem";
import {
  starResultTitle,
  starResultWrapperStyle,
  titleWrapperStyle,
  visitCountStyle,
  lastVisitedStyle,
  headerWrapperStyle,
  headerPathStyle,
  visitItemsWrapperStyle,
  subdomainWrapperStyle,
  subdomainTitleStyle,
  subdomainTextStyle,
  subdomainHeaderStyle,
  subdomainTitleWrapperStyle,
  historyItemsWrapperStyle,
  subdomainVisitsStyle,
  subdomainCountStyle,
  closePanelButtonStyle,
} from "./FocusedStarPanel.css";
import { panelStyle } from "./Sidepanel.css";

const { locale } = new Intl.DateTimeFormat().resolvedOptions();

const fullFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "full" });
export function weekdayMonthDayYear(date: Date | string | number) {
  if (typeof date === "string") return fullFormatter.format(new Date(date));
  if (typeof date === "number") {
    const d = new Date();
    d.setTime(date);
    return fullFormatter.format(d);
  }
  return fullFormatter.format(date);
}

export function FocusedStarSubdomainHistory({
  name,
  subdomain,
  history,
  visits,
  subdomains,
}) {
  return (
    <div className={subdomainWrapperStyle}>
      <div className={subdomainHeaderStyle}>
        {subdomain !== name || subdomains > 1 ? (
          <div className={subdomainTitleWrapperStyle}>
            <h3 className={subdomainTitleStyle}>
              <span className={subdomainTextStyle}>{subdomain}</span>
              {subdomain !== name ? <span>.{name}</span> : null}
            </h3>
            <span className={subdomainVisitsStyle}>
              {visits} visit{visits > 1 ? "s" : ""}
            </span>
          </div>
        ) : null}
        <div key="header" className={headerWrapperStyle}>
          <div className={headerPathStyle}>
            top path{history.length > 1 ? "s" : ""}
          </div>
        </div>
      </div>
      <div className={historyItemsWrapperStyle}>
        {history.slice(0, 10).map((v) => (
          <FocusedStarHistoryItem visit={v} />
        ))}
      </div>
    </div>
  );
}

export function FocusedStarPanel({ star, setFocus }) {
  const date = new Date();
  date.setTime(star.last_visited);

  useEffect(() => {
    const cb = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      if (e.key === "Escape") {
        setFocus(null);
        setTimeout(() => document.getElementById("search")?.focus(), 5);
      }
    };
    window.addEventListener("keyup", cb);
    return () => {
      window.removeEventListener("keyup", cb);
    };
  }, []);

  const subdomainHistory = star.history.reduce((subs, h) => {
    if (h.subdomain) {
      subs[h.subdomain] = subs[h.subdomain] || { history: [], visits: 0 };
      subs[h.subdomain].history.push(h);
      subs[h.subdomain].visits += h.visits;
    } else {
      subs[star.name] = subs[star.name] || { history: [], visits: 0 };
      subs[star.name].history.push(h);
      subs[star.name].visits += h.visits;
    }
    return subs;
  }, {});

  const subdomains = Object.keys(subdomainHistory).sort((a, b) =>
    subdomainHistory[a].visits > subdomainHistory[b].visits
      ? -1
      : subdomainHistory[a].visits < subdomainHistory[b].visits
      ? 1
      : 0
  );

  return (
    <div className={panelStyle}>
      <div
        className={starResultWrapperStyle}
        onClick={(e) => e.stopImmediatePropagation()}
      >
        <div
          className={titleWrapperStyle}
          style={{
            height: star.d * 6 + 20,
          }}
        >
          <div
            style={{
              position: "relative",
              left: star.d * 0.5,
              width: star.d * 5 + 20,
            }}
          >
            <Star
              star={star}
              name={star.name}
              offset={(star.d * 5) / 2}
              scale={5}
            />
          </div>
          <h2 className={starResultTitle}>{star.name}</h2>
          <div className={closePanelButtonStyle}>
            <CloseButton onClick={() => setFocus(null)} />
          </div>
        </div>
        <div className={star.visits ? visitCountStyle : subdomainCountStyle}>
          {star.visits
            ? `${star.visits} visit${star.visits > 1 ? "s" : ""}`
            : star.name === "browserverse.cloud"
            ? "You haven't looked at anyone else's contstellations yet. Swap your constellation links with your friends and see how your signs and browsing habits compare."
            : "You haven't visited this domain yet."}
        </div>
        {star.visits ? (
          <div
            className={
              subdomains.length ? lastVisitedStyle : subdomainCountStyle
            }
          >
            Last visited: {weekdayMonthDayYear(date)}
          </div>
        ) : null}
        {subdomains.length ? (
          <div className={subdomainCountStyle}>
            Subdomains: {subdomains.length}
          </div>
        ) : null}
        <div className={visitItemsWrapperStyle}>
          {subdomains.map((s) => (
            <FocusedStarSubdomainHistory
              key={s}
              name={star.name}
              subdomain={s}
              history={subdomainHistory[s].history}
              visits={subdomainHistory[s].visits}
              subdomains={subdomains.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
