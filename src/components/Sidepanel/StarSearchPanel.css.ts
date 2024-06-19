import { style } from "@vanilla-extract/css";

export const searchPanelStyle = style({
  position: "relative",
});

export const searchInputStyle = style({
  outline: "solid 1px #333",
  border: "none",
  padding: "8px 16px",
  fontSize: "21px",
  fontFamily: `'GFS Neohellenic', 'Helvetica Neue', arial, sans-serif`,
  background: "#00000099",
  color: "#fff",
  borderRadius: "4px",
  flex: "auto",
  "::placeholder": {
    color: "#ccc",
  },
  ":focus": {
    outline: "solid 1px #fff",
  },
  ":hover": {
    outline: "solid 1px #999",
  }
});

export const searchResultsStyle = style({
  overflowY: "auto",
  listStyle: "none",
  padding: 0,
  margin: 0,
  maxHeight: "calc(100vh - 108px)",
  display: "flex",
  flexDirection: "column",
  background: "#00000099",
  borderRadius: "4px",
  border: "solid 1px #333",
});

export const searchStatsStyle = style({
  position: "absolute",
  top: -44,
  right: 4,
  padding: "0 16px",
  fontSize: "18px",
  fontFamily: `'GFS Neohellenic', 'Helvetica Neue', arial, sans-serif`,
  color: "#eee",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
});

export const navPanelStyle = style({
  display: "flex",
  alignItems: "center",
  marginBottom: "8px",
});