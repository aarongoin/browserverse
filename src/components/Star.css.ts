import { style, styleVariants } from "@vanilla-extract/css";

export const starGlowStyle = style({
  position: "absolute",
  left: -120,
  right: -120,
  top: -120,
  bottom: -120,
  borderRadius: "50%",
  pointerEvents: "none",
  filter: "blur(10px)"
});

export const starGlowColorStyle = styleVariants({
  D: { background: `radial-gradient(circle, #FF5E1911 0%, #FF5E1900 100%)` },
  M: { background: `radial-gradient(circle, #FF9C3311 0%, #FF9C3300 100%)` },
  K: { background: `radial-gradient(circle, #FFCD6211 0%, #FFCD6200 100%)` },
  G: { background: `radial-gradient(circle, #FFFD9911 0%, #FFFD9900 100%)` },
  F: { background: `radial-gradient(circle, #C2FFFF11 0%, #C2FFFF00 100%)` },
  A: { background: `radial-gradient(circle, #9FEAFF11 0%, #9FEAFF00 100%)` },
  B: { background: `radial-gradient(circle, #69CFFF11 0%, #69CFFF00 100%)` },
  S: { background: `radial-gradient(circle, #FFFEE411 0%, #FFFEE400 100%)` },
  X: { background: `radial-gradient(circle, #FFFFFF11 0%, #FFFFFF00 100%)` },
});

export const starStyle = style({
  position: "absolute",
  transform: "translate(-50%, -50%)",
  borderRadius: "50%",
  transition: "all 250ms ease-out",
});

export const starColorStyle = styleVariants({
  D: { background: `radial-gradient(circle, rgba(255,255,255,1) 5%, #FF5E19 95%)` },
  M: { background: `radial-gradient(circle, rgba(255,255,255,1) 5%, #FF9C33 95%)` },
  K: { background: `radial-gradient(circle, rgba(255,255,255,1) 5%, #FFCD62 95%)` },
  G: { background: `radial-gradient(circle, rgba(255,255,255,1) 5%, #FFFD99 95%)` },
  F: { background: `radial-gradient(circle, rgba(255,255,255,1) 5%, #C2FFFF 95%)` },
  A: { background: `radial-gradient(circle, rgba(255,255,255,1) 5%, #9FEAFF 95%)` },
  B: { background: `radial-gradient(circle, rgba(255,255,255,1) 5%, #69CFFF 95%)` },
  S: { background: `radial-gradient(circle, rgba(255,255,255,1) 5%, #FFFEE4 95%)` },
  X: { background: `radial-gradient(circle, rgba(255,255,255,1) 5%, #FFFFFF 95%)` },
})