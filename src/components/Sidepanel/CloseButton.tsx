import { h } from "preact";
import { closeQueryButtonStyle, CloseButtonSvgStyle } from "./CloseButton.css";

export function CloseButton({ onClick }) {
  return (
    <button className={closeQueryButtonStyle} onClick={onClick}>
      <svg className={CloseButtonSvgStyle} stroke-width="0" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
      </svg>
    </button>
  );
}
