import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { DomainItems } from "../services/history";

type StarmapProps = {
  history: DomainItems;
  dim: number;
  offset: number;
};

export function ConstellationMap({ visible, history, dim, offset, names }) {
  const [state, setState] = useState(false);
  useEffect(() => {
    setTimeout(setState, 0, visible);
  }, []);
  const canvasStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    height: "100vh",
  };
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        transition: "opacity 250ms ease-in-out",
        opacity: state ? 1 : 0,
      }}
    >
      <canvas
        id="con-star-lines"
        style={canvasStyle}
        width={window.innerWidth}
        height={window.innerHeight}
        ref={(el) => {
          const ctx = el?.getContext("2d");
          if (!ctx || !el) return;
          // draw the lines of the constellation
          // sort constellation in order of increasing distance away from the browserverse star
          ctx.fillStyle = "#00000099";
          ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
          const stars = names
            .map((h) => history[h])
            .sort((a, b) => {
              const da = Math.sqrt(a.x ** 2 + (a.y + 0.05) ** 2);
              const db = Math.sqrt(b.x ** 2 + (b.y + 0.05) ** 2);
              return da - db;
            });
          const edges = [];
          // skip first one because we know it must be the browserverse star
          for (let s = 1; s < stars.length; s++) {
            const star = stars[s];
            let closest = stars[0];
            let delta = Math.sqrt(star.x ** 2 + (star.y + 0.05) ** 2);
            // connect each constellation star to closest star that's connected to the browserverse star else connect to the browserverse star
            for (let i = 1; i < s; i++) {
              let _star = stars[i];
              const _delta = Math.sqrt(
                (star.x - _star.x) ** 2 + (star.y - _star.y + 0.05) ** 2
              );
              if (_delta <= delta) {
                closest = _star;
                delta = _delta;
              }
            }
            edges.push([closest.x, closest.y, star.x, star.y]);
          }
          for (const [x0, y0, x1, y1] of edges) {
            ctx.strokeStyle = "#ffffffee";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x0 * dim + dim + offset, y0 * dim + dim);
            ctx.lineTo(x1 * dim + dim + offset, y1 * dim + dim);
            ctx.stroke();
          }
        }}
      ></canvas>
      <canvas
        id="con-star-glows"
        style={{ ...canvasStyle, filter: "blur(2px)" }}
        width={window.innerWidth}
        height={window.innerHeight}
        ref={(el) => {
          const ctx = el?.getContext("2d");
          if (!ctx || !el) return;
          // draw the stars with their immediate glow
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          for (const h of names) {
            const star = history[h];
            const d = star.d * 40;
            const x = star.x * dim + dim + offset;
            const y = star.y * dim + dim;
            // draw star glow
            const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, d);
            glowGradient.addColorStop(0, `${star.color}44`);
            glowGradient.addColorStop(1, `#ffffff00`);
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.ellipse(x, y, d, d, Math.PI / 4, 0, 2 * Math.PI);
            ctx.fill();
          }
        }}
      ></canvas>
      <canvas
        id="con-star-bodies"
        style={canvasStyle}
        width={window.innerWidth}
        height={window.innerHeight}
        ref={(el) => {
          const ctx = el?.getContext("2d");
          const image = document.getElementById("sunTexture");
          if (!ctx || !el) return;
          // draw the star bodies with their corona glows
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          for (const h of names) {
            const star = history[h];
            let d = star.d * 1.25;
            const x = star.x * dim + dim + offset;
            const y = star.y * dim + dim;
            // draw star corona first
            const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, d);
            glowGradient.addColorStop(0.5, `${star.color}66`);
            glowGradient.addColorStop(0.6, `${star.color}33`);
            glowGradient.addColorStop(0.7, `${star.color}11`);
            glowGradient.addColorStop(0.8, `${star.color}09`);
            glowGradient.addColorStop(0.99, `${star.color}00`);
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.ellipse(x, y, d * 3, d * 3, Math.PI / 4, 0, 2 * Math.PI);
            ctx.fill();

            // now scale down and draw actual star body
            d = star.d / 2;
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
            }
            // draw the star
            const starGradient = ctx.createRadialGradient(x, y, 0, x, y, d);
            starGradient.addColorStop(0.05, "#ffffffee");
            starGradient.addColorStop(0.95, `${star.color}aa`);
            ctx.fillStyle = starGradient;
            ctx.beginPath();
            ctx.ellipse(x, y, d, d, Math.PI / 4, 0, 2 * Math.PI);
            ctx.fill();
          }
        }}
      ></canvas>
    </div>
  );
}
