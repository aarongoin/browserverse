import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { DomainItems } from "../services/history";
import clamp from "../utils/clamp";
import { TreeBranch } from "../utils/QuadTree";

type StarmapProps = {
  node: TreeBranch;
  history: DomainItems;
  dim: number;
  offset: number;
};

export function Starmap({ history, dim, offset, names }) {
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
    <div style={{ position: "relative" }}>
      <canvas
        id="star-glows"
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
            glowGradient.addColorStop(
              0,
              `#ffffff18`
            );
            glowGradient.addColorStop(
              1,
              `${star.color}00`
            );
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.ellipse(x, y, d, d, Math.PI / 4, 0, 2 * Math.PI);
            ctx.fill();
          }
        }}
      ></canvas>
      <canvas
        id="star-bodies"
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
            glowGradient.addColorStop(
              0.5,
              `${star.color}66`
            );
            glowGradient.addColorStop(
              0.6,
              `${star.color}33`
            );
            glowGradient.addColorStop(
              0.7,
              `${star.color}11`
            );
            glowGradient.addColorStop(
              0.8,
              `${star.color}09`
            );
            glowGradient.addColorStop(
              0.99,
              `${star.color}00`
            );
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
            starGradient.addColorStop(
              0.95,
              `${star.color}aa`
            );
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
