import { style } from "@vanilla-extract/css";

export const constellationItemStyle = style({
  display: "flex",
  flexDirection: "column",
  flex: "auto",
  marginRight: 16
});

export const constellationItemWrapperStyle = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 16
});

export const constellationIdStyle = style({
  fontSize: "18px",
  fontWeight: 700,
  fontFamily: `'GFS Neohellenic Bold', 'Helvetica Neue', arial, sans-serif`,
  color: "#fff",
});

export const constellationStarsStyle = style({
  fontSize: "16px",
  fontWeight: 400,
  fontFamily: `'GFS Neohellenic', 'Helvetica Neue', arial, sans-serif`,
  color: "#fff",
});

export const copyButtonStyle = style({
  flex: "none",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  outline: "none",
  border: "none",
  borderRadius: "50%",
  padding: "5.5px",
  color: "#ccc",
  background: "#ffffff00",
  transition: "all 120ms ease-in-out",
  ":focus": {
    color: "#fff",
    background: "#ffffff33",
  },
  ":hover": {
    color: "#fff",
    background: "#ffffff33",
  },
});

export const copyButtonSvgStyle = style({
  fill: "#ccc",
  stroke: "#ccc",
  height: 21,
  width: 21,
  transition: "all 120ms ease-in-out",
  transform: "translateY(1px)",
  selectors: {
    [`${copyButtonStyle}:hover &, ${copyButtonStyle}:focus &`]: {
      fill: "#fff",
      stroke: "#fff",
      transform: "translateY(0)",
    },
  },
});
