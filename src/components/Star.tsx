import { h } from "preact";
import { DomainItem } from "../services/history";
import {
  starColorStyle,
  starGlowColorStyle,
  starGlowStyle,
  starStyle,
} from "./Star.css";

type StarProps = {
  star: DomainItem;
  name: string;
  dim?: number;
  offset?: number;
  scale?: number;
  halo?: boolean;
};

export function Star({
  star,
  name,
  dim = 0,
  offset = 0,
  halo = true,
  scale = 1,
  ...props
}: StarProps) {
  return (
    <div
      {...props}
      data-domain_id={name}
      className={starStyle}
      style={{
        zIndex: star.d,
        left: star.x * dim + dim + offset,
        top: star.y * dim + dim,
        width: scale * star.d,
        height: scale * star.d,
        boxShadow: `0 0 10px ${
          halo ? star.d : star.d / 2
        }px rgba(255,255,255,0.25)`,
        background: `radial-gradient(circle, rgba(255,255,255,1) 5%, ${star.color} 95%)`
      }}
    >
      {halo ? (
        <div
          className={starGlowStyle}
          style={{
            background: `radial-gradient(circle, ${star.color}11 0%, ${star.color}00 100%)`
          }}
        ></div>
      ) : null}
    </div>
  );
}
