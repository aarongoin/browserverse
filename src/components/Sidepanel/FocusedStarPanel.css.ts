import { style } from "@vanilla-extract/css";

export const titleWrapperStyle = style({
  padding: "16px",
  flex: "none",
  display: "flex",
  alignItems: "center",
  position: "relative",
});

export const closePanelButtonStyle = style({
  position: "absolute",
  top: 8,
  right: 8,
});

export const visitCountStyle = style({
  fontSize: "18px",
  padding: "8px 16px 4px 16px",
});

export const lastVisitedStyle = style({
  fontSize: "18px",
  padding: "0 16px 4px 16px",
});

export const subdomainCountStyle = style({
  fontSize: "18px",
  padding: "0 16px 16px 16px",
});

export const subdomainWrapperStyle = style({
  position: "relative",
});

export const subdomainVisitsStyle = style({
  fontSize: "18px",
  fontWeight: 400,
  fontFamily: `'GFS Neohellenic', 'Helvetica Neue', arial, sans-serif`,
});

export const subdomainTitleWrapperStyle = style({
  color: "#ccc",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const subdomainTitleStyle = style({
  fontSize: "26px",
  fontWeight: 700,
  fontFamily: `'GFS Neohellenic Bold', 'Helvetica Neue', arial, sans-serif`,
  color: "#ccc",
  margin: 0,
});

export const subdomainTextStyle = style({
  fontWeight: 700,
  fontFamily: `'GFS Neohellenic Bold', 'Helvetica Neue', arial, sans-serif`,
  color: "#fff",
});

export const subdomainHeaderStyle = style({
  borderTop: "solid 1px #ffffff33",
  position: "sticky",
  top: 0,
  zIndex: 10,
  backgroundColor: "#000",
  padding: "8px 16px 0 16px",
});

export const historyItemsWrapperStyle = style({
  padding: "0 16px 16px 16px",
});

export const visitItemsWrapperStyle = style({
  fontSize: "18px",
  overflowY: "auto",
});

export const headerWrapperStyle = style({
  whiteSpace: "nowrap",
  display: "flex",
  alignItems: "center",
  fontFamily: `'GFS Neohellenic Bold', 'Helvetica Neue', arial, sans-serif`,
  fontWeight: 700,
  paddingBottom: "8px",
  // borderBottom: "solid 1px #ffffff22",
});

export const headerPathStyle = style({
  flex: "auto",
  overflow: "hidden",
  paddingTop: "4px",
});

export const starResultTitle = style({
  fontSize: "32px",
  fontFamily: `'GFS Neohellenic Bold', 'Helvetica Neue', arial, sans-serif`,
  fontWeight: 700,
  color: "#fff",
  margin: 0,
});

export const starResultWrapperStyle = style({
  background: "#00000099",
  borderRadius: "4px",
  display: "flex",
  border: "solid 1px #333",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "stretch",
  fontSize: "21px",
  fontFamily: `'GFS Neohellenic', 'Helvetica Neue', arial, sans-serif`,
  color: "#eee",
  overflow: "hidden",
});
