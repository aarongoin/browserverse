import { style } from "@vanilla-extract/css";

export const constellationsButtonStyle = style({
  flex: "none",
  display: "flex",
  alignItems: "center",
  outline: "solid 1px #333",
  border: "none",
  borderRadius: 4,
  padding: "8px 16px",
  fontSize: "21px",
  fontFamily: `'GFS Neohellenic', 'Helvetica Neue', arial, sans-serif`,
  color: "#ccc",
  background: "#00000099",
  ":focus": {
    color: "#fff",
    outline: "solid 1px #fff",
  },
  ":hover": {
    color: "#fff",
    outline: "solid 1px #999",
  },
});

export const buttonSelectedStyle = style({
  outline: "solid 1px #fff",
  color: "#fff",
  ":hover": {
    color: "#fff",
    outline: "solid 1px #fff",
  },
});

export const buttonSvgStyle = style({
  fill: "#ccc",
  stroke: "#ccc",
  height: 21,
  width: 21,
  marginLeft: 8,
  selectors: {
    [`${constellationsButtonStyle}:hover &, ${constellationsButtonStyle}:focus &`]: {
      fill: "#fff",
      stroke: "#fff",
    },
  },
});

export const constellationTitleStyle = style({
  fontSize: "26px",
  fontWeight: 700,
  fontFamily: `'GFS Neohellenic Bold', 'Helvetica Neue', arial, sans-serif`,
  color: "#fff",
  margin: "8px 0 8px 16px",
});

export const constellationItemsWrapperStyle = style({
  borderTop: "solid 1px #ffffff33",
  margin: "8px 0 0 0",
  padding: 0,
  listStyle: "none",
});
