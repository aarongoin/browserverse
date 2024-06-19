import { style } from "@vanilla-extract/css";

export const focusRingStyle = style({
  position: "absolute",
  transform: "translate(-50%, -50%) scale(100)",
  border: "solid 0px #00000000",
  borderRadius: "50%",
  transition: "all 200ms ease-in-out",
});

export const focusRingActiveStyle = style({
  transform: "translate(-50%, -50%) scale(1)",
  border: "solid 1px #fff",
});
