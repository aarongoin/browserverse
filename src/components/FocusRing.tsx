import { h } from "preact";
import { focusRingActiveStyle, focusRingStyle } from "./FocusRing.css";

export function FocusRing({
  focus,
  history,
  dim,
  offset,
}: {
  focus: string | null;
}) {
  return focus ? (
    <div
      key={focus}
      className={focusRingStyle}
      ref={(el) => {
        if (!el) return;
        const star = history[focus];
        el.style.left = `${star.x * dim + dim + offset}px`;
        el.style.top = `${star.y * dim + dim}px`;
        el.style.width = `${Math.max(16, star.d * 3)}px`;
        el.style.height = `${Math.max(16, star.d * 3)}px`;
        setTimeout(() => {
          el.classList.add(focusRingActiveStyle);
        }, 5);
      }}
    />
  ) : null;
}
