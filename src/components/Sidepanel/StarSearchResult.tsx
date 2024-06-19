import { h } from "preact";
import {
  resultTextStyle,
  queryStyle,
  searchResultTextStyle,
} from "./StarSearchResult.css";
import { Star } from "../Star";

export function StarSearchResult({ query, selected, star, setFocus }) {
  return (
    <li
      key={star.name}
      onClick={(e) => {
        e.stopImmediatePropagation();
        setFocus(star.name);
      }}
      className={searchResultTextStyle}
      style={{ backgroundColor: selected ? "#ffffff44" : undefined }}
      {...(selected
        ? {
            ref: (el) =>
              (el as HTMLLIElement)?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
              }),
          }
        : null)}
    >
      <div
        style={{
          position: "relative",
          left: star.d * 0.5,
          width: 48,
        }}
      >
        <Star
          star={star}
          name={star.name}
          halo={false}
          offset={(48 - star.d) / 2}
          scale={2}
        />
      </div>
      <span className={resultTextStyle}>
        {star.name.split(query).map((txt, i, a) =>
          a.length > 1 && i ? (
            [
              <span key={i} className={queryStyle}>
                {query}
              </span>,
              <span key={txt}>{txt}</span>,
            ]
          ) : (
            <span key={txt}>{txt}</span>
          )
        )}
      </span>
    </li>
  );
}
