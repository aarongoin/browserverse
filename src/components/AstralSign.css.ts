import { style } from "@vanilla-extract/css";

export const panelStyle = style({
  position: "absolute",
  top: 16,
  left: 16,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "stretch",
  color: "white",
  background: "#00000099",
  borderRadius: "4px",
  border: "solid 1px #333",
});

export const textStyle = style({
  fontSize: "26px",
  fontWeight: 700,
  fontFamily: `'GFS Neohellenic Bold', 'Helvetica Neue', arial, sans-serif`,
  color: "#fff",
  margin: "8px 16px",
});