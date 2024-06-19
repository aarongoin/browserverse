import { style } from "@vanilla-extract/css";

export const bmcButtonStyle = style({
  position: "absolute",
  overflow: "hidden",
  outline: "none",
  border: "none",
  bottom: 16,
  left: 16,
  height: 40,
  width: 195,
  backgroundColor: "#00000000",
  color: "#000",
  borderRadius: "4px",
  padding: 0,
  cursor: "pointer",
});

export const bmcLinkStyle = style({
  outline: "none",
  border: "none",
  display: "flex",
  alignItems: "center",
  height: 40,
  minWidth: 40,
  padding: 0,
  textDecoration: "none",
  color: "#000",
});

export const bmcImageStyle = style({
  width: 40,
  height: 40,
  flex: "none",
  borderRadius: "4px",
  transition: "border-radius 240ms 60ms ease-in-out",
  selectors: {
    [`${bmcButtonStyle}:hover &, ${bmcButtonStyle}:focus &`]: {
      borderRadius: 0,
      transition: "border-radius 240ms ease-in-out",
    }
  }
});

export const bmcTextStyle = style({
  flex: "none",
  fontSize: "18px",
  fontWeight: 700,
  fontFamily: `'GFS Neohellenic Bold', 'Helvetica Neue', arial, sans-serif`,
  filter: "opacity(0%)",
  transition: "all 240ms ease-in-out",
  userSelect: "none",
  width: 0,
  height: 40,
  overflow: "clip",
  backgroundColor: "#FFDD01",
  display: "flex",
  alignItems: "center",
  whiteSpace: "nowrap",
  selectors: {
    [`${bmcButtonStyle}:hover &, ${bmcButtonStyle}:focus &`]: {
      filter: "opacity(100%)",
      width: 155,
      transition: "width 240ms ease-in-out, filter 240ms 60ms ease-in-out",
    }
  }
});
