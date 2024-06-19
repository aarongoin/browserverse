import { h } from "preact";
import {
  bmcButtonStyle,
  bmcLinkStyle,
  bmcImageStyle,
  bmcTextStyle,
} from "./BuyMeACoffeeButton.css";

const bmc_logo = new URL(
  "../../assets/bmc-logo-yellow.png?width=40&height=40",
  import.meta.url
);

export function BuyMeACoffeeButton() {
  return (
    <button className={bmcButtonStyle}>
      <a className={bmcLinkStyle} href="https://www.buymeacoffee.com/browserverse">
        <img src={bmc_logo.toString()} className={bmcImageStyle}></img>
        <div className={bmcTextStyle}>Support browserverse</div>
      </a>
    </button>
  );
}
