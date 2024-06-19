import { style } from "@vanilla-extract/css";

export const resultTextStyle = style({
  flex: "auto",
  overflow: "hidden",
  textOverflow: "ellipses",
  whiteSpace: "nowrap",
});

export const queryStyle = style({
  fontWeight: 700,
  fontFamily: `'GFS Neohellenic Bold', 'Helvetica Neue', arial, sans-serif`,
  color: "#fff",
});

export const searchResultTextStyle = style({
  padding: "8px 16px 8px 0px",
  fontSize: "21px",
  fontFamily: `'GFS Neohellenic', 'Helvetica Neue', arial, sans-serif`,
  color: "#ccc",
  display: "flex",
  alignItems: "center",
  minHeight: 48,
});
