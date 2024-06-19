import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { packConstellation } from "../../services/constellation";
import {
  constellationItemWrapperStyle,
  constellationItemStyle,
  constellationIdStyle,
  constellationStarsStyle,
  copyButtonStyle,
  copyButtonSvgStyle,
} from "./ConstellationItem.css";
import { weekdayMonthDayYear } from "./FocusedStarPanel";

export function ConstellationItem({ selected, constellation, setFocus }) {
  return (
    <li
      className={constellationItemWrapperStyle}
      onClick={(e) => {
        e.stopImmediatePropagation();
        setFocus(`constellation_${constellation.date}`);
      }}
      style={{ backgroundColor: selected ? "#ffffff44" : undefined }}
      {...(selected
        ? {
            ref: (el) =>
              (el as HTMLLIElement)?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
              }),
          }
        : null)}
    >
      <div className={constellationItemStyle}>
        <span className={constellationIdStyle}>
          {constellation.date === 0
            ? "Super Constellation"
            : weekdayMonthDayYear(constellation.date)}
        </span>
        {selected ? (
          <span className={constellationStarsStyle}>
            {constellation.stars.map((s, i) =>
              s.name === "browserverse.cloud" ? null : (
                <span>
                  {i > 1 ? ", " : null}
                  <span style={{ color: s.color }}>{s.name}</span>
                </span>
              )
            )}
          </span>
        ) : null}
      </div>
      {selected ? <CopyButton constellation={constellation} /> : null}
    </li>
  );
}

function CopyButton({ constellation }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      const t = setTimeout(setCopied, 3000, false);
      return () => clearTimeout(t);
    }
  }, [copied]);
  return (
    <button
      className={copyButtonStyle}
      onClick={(e) => {
        e.stopImmediatePropagation();
        window.navigator.clipboard.writeText(
          `https://browserverse.cloud/?${packConstellation(constellation)}`
        );
        setCopied(true);
      }}
    >
      <svg stroke-width="0" viewBox="0 0 24 24" className={copyButtonSvgStyle}>
        {copied ? (
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
        ) : (
          <path d="M18 2H9c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H9V4h9v12zM3 15v-2h2v2H3zm0-5.5h2v2H3v-2zM10 20h2v2h-2v-2zm-7-1.5v-2h2v2H3zM5 22c-1.1 0-2-.9-2-2h2v2zm3.5 0h-2v-2h2v2zm5 0v-2h2c0 1.1-.9 2-2 2zM5 6v2H3c0-1.1.9-2 2-2z"></path>
        )}
      </svg>
    </button>
  );
}
