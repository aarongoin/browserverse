import { h } from "preact";
import { useMemo } from "preact/hooks";

export type CosmicBackgroundProps = {
  width: number;
  height: number;
};

function randomPoints(count, width, height) {
  const points = [];
  for (let i = 0; i < count; i++) {
    points.push([
      Math.floor(Math.random() * width),
      Math.floor(Math.random() * height),
    ]);
  }
  return points;
}

export function CosmicBackground({ width, height }: CosmicBackgroundProps) {
  const stars = useMemo(
    () => [
      {
        fillStyle: "#ffffff22",
        points: randomPoints(5000, width, height),
      },
      {
        fillStyle: "#ffffff66",
        points: randomPoints(1000, width, height),
      },
      {
        fillStyle: "#ffffff66",
        points: randomPoints(500, width, height),
      },
      {
        fillStyle: "#FB8F4B66",
        points: randomPoints(500, width, height),
      },
      {
        fillStyle: "#FFCD6266",
        points: randomPoints(500, width, height),
      },
      {
        fillStyle: "#FFFD9966",
        points: randomPoints(500, width, height),
      },
      {
        fillStyle: "#C2FFFF66",
        points: randomPoints(500, width, height),
      },
      {
        fillStyle: "#ADEDFF66",
        points: randomPoints(500, width, height),
      },
      {
        fillStyle: "#858FFF66",
        points: randomPoints(500, width, height),
      },
    ],
    [width, height]
  );
  return (
    <canvas
      width={width}
      height={height}
      // style={{ filter:  }}
      ref={(el) => {
        if (el) {
          const ctx = el.getContext("2d");
          if (!ctx) return;
          setTimeout(() => {
            ctx.clearRect(0, 0, width, height);
            for (const { fillStyle, points } of stars) {
              ctx.fillStyle = fillStyle;
              for (const [x, y] of points) ctx.fillRect(x, y, 1, 1);
            }
          }, 0);
        }
      }}
    ></canvas>
  );
}
