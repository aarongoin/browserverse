import { h } from "preact";
import { panelStyle, textStyle } from "./AstralSign.css";

export function AstralSign({ sign }: { sign: string | undefined | null }) {
  return sign ? (
    <div className={panelStyle}>
      <h2 className={textStyle}>{sign}</h2>
    </div>
  ) : null;
}
