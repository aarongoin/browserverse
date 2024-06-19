import { h } from "preact";
import {
  panelStyle,
  fortuneHeaderStyle,
  fortuneTextStyle,
} from "./Fortune.css";

export function Fortune({ fortune }: { fortune: string | null | undefined }) {
  return fortune ? (
    <div className={panelStyle}>
      <h3 className={fortuneHeaderStyle}>Greetings, Traveler.</h3>
      <div className={fortuneTextStyle}>{fortune}</div>
    </div>
  ) : null;
}
