import { style } from "@vanilla-extract/css";

export const closeQueryButtonStyle = style({
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
})

export const CloseButtonSvgStyle = style({
  fill: "#ccc",
  stroke: "#ccc",
  height: 21,
  width: 21,
  transition: "all 120ms ease-in-out",
  transform: "translateY(0)",
  selectors: {
    [`${closeQueryButtonStyle}:hover &, ${closeQueryButtonStyle}:focus &`]: {
      fill: "#fff",
      stroke: "#fff",
      transform: "translateY(-1px)",
    },
  },
});
