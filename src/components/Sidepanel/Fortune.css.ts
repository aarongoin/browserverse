import { style } from "@vanilla-extract/css";

export const panelStyle = style({
  position: "absolute",
  width: "clamp(200px, 25vw, 500px)",
  bottom: 16,
  right: 16,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "stretch",
  color: "white",
  background: "#00000099",
  borderRadius: "4px",
  border: "solid 1px #333",
});

export const fortuneHeaderStyle = style({
  fontSize: "20px",
  fontWeight: 700,
  fontFamily: `'GFS Neohellenic Bold', 'Helvetica Neue', arial, sans-serif`,
  color: "#fff",
  margin: "8px 16px 0 16px",
});

export const fortuneTextStyle = style({
  fontSize: "18px",
  margin: "8px 16px",
});
