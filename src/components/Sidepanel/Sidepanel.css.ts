import { style } from "@vanilla-extract/css";

export const panelStyle = style({
  position: "absolute",
  width: "clamp(200px, 25vw, 500px)",
  top: 16,
  bottom: 16,
  right: 16,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "stretch",
  color: "white",
});
