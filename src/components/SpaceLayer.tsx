import { h, VNode } from "preact";
import { useEffect, useState } from "preact/hooks";
import { spaceLayerStyle } from "./SpaceLayer.css";

export type SpaceLayoutProps = {
  width: number;
  height: number;
  children: (VNode | null)[] | VNode | null;
};

export function SpaceLayer({
  width,
  height,
  children,
}: SpaceLayoutProps) {
  const [scale, setScale] = useState(false);
  useEffect(() => {
    const tid = setTimeout(setScale, 16, true);
    return () => clearTimeout(tid);
  }, []);
  return (
    <div
      data-space="space"
      className={spaceLayerStyle}
      style={{
        width: width,
        height: height,
        transform: scale
          ? "rotate(0turn) scale(1, 1)"
          : "rotate(0.02turn) scale(1.25, 1.25)",
      }}
    >
      {children}
    </div>
  );
}
