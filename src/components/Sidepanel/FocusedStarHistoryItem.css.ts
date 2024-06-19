import { style } from "@vanilla-extract/css";

export const wrapperStyle = style({
  whiteSpace: "nowrap",
  display: "flex",
  alignItems: "center",
  marginTop: 4,
});

export const linkStyle = style({
  flex: "auto",
  display: "flex",
  alignItems: "flex-start",
  overflow: "hidden",
  color: "#ccc",
  textDecoration: "none",
  marginBottom: "4px",
  ":hover": {
    color: "#fff",
  },
  ":focus": {
    color: "#fff",
  },
});

export const pathnameStyle = style({
  overflow: "hidden",
  borderBottom: "solid 1px #999",
  transition: "all 60ms ease-in-out",
  width: "min-content",
  selectors: {
    [`${linkStyle}:hover &, ${linkStyle}:focus &`]: {
      borderBottom: "solid 1px #fff",
    },
  },
});


export const titleStyle = style({
  overflow: "hidden",
  // transition: "all 60ms ease-in-out",
  // selectors: {
  //   [`${linkStyle}:hover &, ${linkStyle}:focus &`]: {
  //     borderBottom: "solid 1px #fff",
  //   },
  // },
});

export const linkSvgStyle = style({
  flex: "none",
  width: 12,
  height: 12,
  margin: "4px 11px 0 3px",
  color: "#ccc",
  fill: "#ccc",
  transition: "all 60ms ease-in-out",
  selectors: {
    [`${linkStyle}:hover &, ${linkStyle}:focus &`]: {
      width: 18,
      height: 18,
      margin: "2px 8px 0 0",
      color: "#fff",
      fill: "#fff",
    },
  },
});
