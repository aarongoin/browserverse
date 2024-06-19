import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { DomainItems } from "../services/history";
import { throttle } from "../utils/debounce";
import { TreeBranch } from "../utils/QuadTree";
import {
  scryglassCanvasStyle,
  scryglassWrapperStyle,
  scryglassLenseStyle,
  scryglassHoverLabelStyle,
  scryglassLabelStyle,
} from "./Scryglass.css";

type ScryglassProps = {
  node: TreeBranch;
  history: DomainItems;
  dim: number;
  offset: number;
  setFocus: (key: string | null) => unknown;
};

const thinChars = ["i", "l", "t", "f"];
const medChars = [".", "r", "s"];

function autosize(txt: string) {
  let count = 4; // for padding
  for (const char of txt) {
    if (thinChars.includes(char)) count += 2;
    else if (medChars.includes(char)) count += 5;
    else count += 7;
  }
  return count;
}

export function Scryglass({
  node,
  history,
  dim,
  offset,
  setFocus,
}: ScryglassProps) {
  const [labels, setLabels] = useState([]);
  useEffect(() => {
    let tid = null;
    const cb = throttle(
      (e: MouseEvent) => {
        const e_x = e.x;
        const e_y = e.y;
        window.requestAnimationFrame(() => {
          const scry = document.querySelector(
            "div[data-id='scryglass']"
          ) as HTMLDivElement | null;
          if (scry) {
            if (tid) window.clearTimeout(tid);
            tid = setTimeout(() => {
              scry.style.opacity = "0";
            }, 1000);
            scry.style.opacity = "1";
            scry.style.left = `${e_x}px`;
            scry.style.top = `${e_y}px`;
            if (scry.lastElementChild)
              (scry.lastElementChild as HTMLDivElement).style.borderColor =
                "rgba(255,255,255, 1)";
          }
          const canvas = document.querySelector(
            "div[data-id='scryglass'] canvas"
          );
          const image = document.getElementById("sunTexture");
          const ctx = canvas?.getContext("2d");
          if (!ctx || !canvas) return;
          const _labels = [];
          ctx.clearRect(0, 0, 200, 200);
          let nearby = 0;
          let mouseOver = null;
          const x0 = e_x - 30;
          const y0 = e_y - 30;
          const x1 = e_x + 30;
          const y1 = e_y + 30;
          const items = node.getDataInBounds(x0, y0, x1, y1);
          items.map((k) => {
            const v = history[k];
            const dx = v.x * dim + dim + offset - e_x;
            const dy = v.y * dim + dim - e_y;
            const delta = Math.sqrt(dx ** 2 + dy ** 2);
            if (delta < 150) nearby++;
            if (delta < 40) {
              const d = v.d * 5;
              const x = dx * 6 + 100;
              const y = dy * 6 + 100;
              if (delta < v.d) {
                mouseOver =
                  mouseOver && mouseOver[1] <= delta ? mouseOver : [k, delta];
              }
              if (delta < 20) {
                let lx = (100 * dx) / delta + 100;
                let ly = (100 * dy) / delta + 100;
                _labels.push({
                  hover: delta < v.d,
                  name: v.name,
                  domain: v.domain,
                  tld: v.tld,
                  x: lx < 100 ? lx - autosize(k) : lx - 4,
                  y: ly,
                });

                // draw line pointing from star to label
                const lineGradient = ctx.createLinearGradient(x, y, lx, ly);
                lineGradient.addColorStop(0.1, "#ffffff00");
                lineGradient.addColorStop(0.9, "#ffffffff");
                ctx.strokeStyle = lineGradient;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(lx, ly);
                ctx.stroke();
              }

              // draw star glow
              const glowGradient = ctx.createRadialGradient(
                x,
                y,
                0,
                x,
                y,
                d * 2
              );
              glowGradient.addColorStop(0.33, `${v.color}ff`);
              glowGradient.addColorStop(0.5, `${v.color}99`);
              glowGradient.addColorStop(0.66, `${v.color}33`);
              glowGradient.addColorStop(0.77, `${v.color}22`);
              glowGradient.addColorStop(0.88, `${v.color}11`);
              glowGradient.addColorStop(0.99, `${v.color}00`);
              ctx.fillStyle = glowGradient;
              ctx.beginPath();
              ctx.ellipse(x, y, d * 2, d * 2, Math.PI / 4, 0, 2 * Math.PI);
              ctx.fill();
              if (image) {
                ctx.drawImage(
                  image,
                  0,
                  0,
                  100,
                  100,
                  x + 1 - d,
                  y + 1 - d,
                  d * 2 - 2,
                  d * 2 - 2
                );
                // ctx.resetTransform();
              }
              // draw the star
              const starGradient = ctx.createRadialGradient(x, y, 0, x, y, d);
              starGradient.addColorStop(0.05, "#ffffffee");
              starGradient.addColorStop(0.95, `${v.color}aa`);
              ctx.fillStyle = starGradient;
              ctx.beginPath();
              ctx.ellipse(x, y, d, d, Math.PI / 4, 0, 2 * Math.PI);
              ctx.fill();
            }
          });

          if (scry && nearby === 0) {
            scry.style.opacity = "0";
            if (scry.lastElementChild)
              (scry.lastElementChild as HTMLDivElement).style.borderColor =
                "rgba(255,255,255, 0)";
          }

          if (mouseOver) {
            canvas.parentElement.parentElement.style.cursor = "pointer";
          } else {
            canvas.parentElement.parentElement.style.cursor = "crosshair";
          }
          setLabels(
            _labels.map((l) =>
              l.hover && mouseOver && mouseOver[0] !== l.name
                ? { ...l, hover: false }
                : l
            )
          );
        });
      },
      16,
      {}
    );
    document.addEventListener("mousemove", cb);
    return () => {
      document.removeEventListener("mousemove", cb);
    };
  }, [node, history]);

  const mouseOver = labels.some((l) => l.hover);

  return (
    <div
      data-id="scryglass"
      className={scryglassWrapperStyle}
      onClick={
        mouseOver
          ? (e) => {
              e.stopImmediatePropagation();
              const l = labels.find((l) => l.hover);
              setFocus(l?.name);
            }
          : undefined
      }
    >
      <canvas
        width={200}
        height={200}
        className={scryglassCanvasStyle}
      ></canvas>
      <div className={scryglassLenseStyle}>
        {labels.map(({ name, domain, tld, hover, x, y }) => {
          return (
            <div
              key={name}
              className={hover ? scryglassHoverLabelStyle : scryglassLabelStyle}
              style={{
                left: x,
                top: y,
                backgroundColor: mouseOver && !hover ? "#bbb" : undefined,
              }}
            >
              <span>{domain}</span>
              <span style={{ color: hover ? "#aaa" : "#999" }}>.{tld}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
