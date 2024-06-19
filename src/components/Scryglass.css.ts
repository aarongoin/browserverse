import { style } from "@vanilla-extract/css";

export const scryglassWrapperStyle = style({
  position: "absolute",
  left: 0,
  top: 0,
  borderRadius: "50%",
  width: 200,
  height: 200,
  backdropFilter: "blur(1.5px)",
  transform: "translate(-50%, -50%)",
  transition: "opacity 1000ms ease-out",
  zIndex: 1000,
});

export const scryglassCanvasStyle = style({
  borderRadius: "50%",
  overflow: "hidden",
});

export const scryglassLenseStyle = style({
  position: "absolute",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  borderRadius: "50%",
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "rgba(255,255,255, 0.0)",
  transition: "border-color 100ms",
});

export const scryglassHoverLabelStyle = style({
  position: "absolute",
  color: "#000",
  borderRadius: 3,
  transform: "translateY(-50%)",
  fontFamily: `'GFS Neohellenic Bold', 'Helvetica Neue', arial, sans-serif`,
  userSelect: "none",
  zIndex: 1,
  backgroundColor: "#fff",
  fontWeight: 700,
  transition: "all 60ms ease-in-out",
  fontSize: "24px",
  padding: "0px 6px 2px 6px",
});

export const scryglassLabelStyle = style({
  position: "absolute",
  color: "#000",
  borderRadius: 3,
  transform: "translateY(-50%)",
  fontFamily: `'GFS Neohellenic Bold', 'Helvetica Neue', arial, sans-serif`,
  userSelect: "none",
  zIndex: 0,
  backgroundColor: "#fff",
  fontWeight: 700,
  transition: "all 60ms ease-in-out",
  fontSize: "16px",
  padding: "1px 4px 1px 4px",
});
