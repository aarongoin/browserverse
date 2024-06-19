import { style, styleVariants } from "@vanilla-extract/css";

export const spaceLayerStyle = style({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  transformOrigin: "center",
  transition: "transform 500ms cubic-bezier(.11,.26,.43,1.07)",
  // cursor: "none",
});
