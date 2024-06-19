import { h } from "preact";
import { useEffect, useMemo } from "preact/hooks";
import { CloseButton } from "./CloseButton";
import {
  closePanelButtonStyle,
  lastVisitedStyle,
  starResultWrapperStyle,
  visitCountStyle,
} from "./FocusedStarPanel.css";
import { panelStyle } from "./Sidepanel.css";
import {
  constellationTitleStyle,
  constellationItemsWrapperStyle,
} from "./ConstellationsPanel.css";
import { ConstellationItem } from "./ConstellationItem";
import { AstralSign } from "../AstralSign";

export function ConstellationsPanel({ constellations, focus, setFocus }) {
  const selected = parseInt(focus.slice(14));
  useEffect(() => {
    const cb = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      if (e.key === "Escape") {
        setFocus(null);
        document.getElementById("search")?.blur();
      }
    };
    window.addEventListener("keyup", cb);
    return () => {
      window.removeEventListener("keyup", cb);
    };
  }, [focus, setFocus]);

  const selectedIndex =
    selected != null
      ? constellations.findIndex((h) => h.date === selected)
      : -1;

  useEffect(() => {
    const cb = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      if (e.key === "ArrowUp") {
        const i = selectedIndex >= 0 ? selectedIndex : 1;
        setFocus(`constellation_${constellations[Math.max(0, i - 1)]?.date}`);
      } else if (e.key === "ArrowDown") {
        const i = selectedIndex;
        setFocus(
          `constellation_${
            constellations[Math.min(constellations.length - 1, i + 1)]?.date
          }`
        );
      }
    };
    window.addEventListener("keydown", cb);
    return () => {
      window.removeEventListener("keydown", cb);
    };
  }, [selectedIndex, constellations, setFocus]);

  return [
    selectedIndex >= 0 ? (
      <AstralSign
        sign={
          selectedIndex === 0
            ? "Your Super Constellation"
            : constellations[selectedIndex]?.name
        }
      />
    ) : null,
    <div className={panelStyle}>
      <div
        className={starResultWrapperStyle}
        onClick={(e) => e.stopImmediatePropagation()}
      >
        <h2 className={constellationTitleStyle}>Constellations</h2>
        <div className={closePanelButtonStyle}>
          <CloseButton onClick={() => setFocus(null)} />
        </div>
        <div className={visitCountStyle}>
          The top ten domains you visit are captured to form a constellation
          centered around the browserverse star.
        </div>
        <div className={lastVisitedStyle}>
          Every day that you browse will be captured as a constellation here.
          Share it with your friends and watch it morph over time.
        </div>
        <ol className={constellationItemsWrapperStyle}>
          {constellations.map((c) => (
            <ConstellationItem
              key={c.date}
              selected={selected === c.date}
              constellation={c}
              setFocus={setFocus}
            />
          ))}
        </ol>
      </div>
    </div>,
  ];
}
