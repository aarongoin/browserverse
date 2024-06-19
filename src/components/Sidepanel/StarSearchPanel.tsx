import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { DomainItem } from "../../services/history";
import { CloseButton } from "./CloseButton";
import {
  buttonSelectedStyle,
  buttonSvgStyle,
  constellationsButtonStyle,
} from "./ConstellationsPanel.css";
import { panelStyle } from "./Sidepanel.css";
import {
  searchInputStyle,
  searchPanelStyle,
  searchResultsStyle,
  searchStatsStyle,
  navPanelStyle,
} from "./StarSearchPanel.css";
import { StarSearchResult } from "./StarSearchResult";

function useSearch(history, setFocus) {
  const [search, _setQuery] = useState({
    query: "",
    selected: null, // item in list
    focused: null, // if search is focused on a single domain
    results: [] as DomainItem[],
  });

  function clearQuery() {
    return _setQuery({ query: "", focused: null, results: [], selected: null });
  }

  function setQuery(query: string) {
    if (!query) return clearQuery();
    // TODO: smarter search someday
    _setQuery((search) => {
      let results =
        search.query && query.startsWith(search.query)
          ? search.results
          : (Array.from(Object.values(history)) as DomainItem[]);
      results = results.filter((r) => r.name.includes(query));
      results.sort((a, b) => {
        let ai = a.name.indexOf(query);
        let bi = b.name.indexOf(query);
        // sort so items with match closest to front of string are closest to the search box
        return ai > bi
          ? 1
          : ai < bi
          ? -1
          : // else sort by visits
          a.visits > b.visits
          ? -1
          : a.visits < b.visits
          ? 1
          : 0;
      });
      const focused = results.length === 1 ? results[0].name : null;
      let prevFocused = search.focused;
      if (focused !== prevFocused) setTimeout(setFocus, 0, focused);
      return { query, focused, results, selected: null };
    });
  }

  return {
    search,
    clearQuery,
    setQuery,
    setSelected: (selected: string | null) =>
      _setQuery((state) => ({ ...state, selected })),
  };
}

type StarSearchPanelProps = {};

export function StarSearchPanel({
  focus,
  state,
  setFocus,
  setConstellation,
}: StarSearchPanelProps) {
  const { search, clearQuery, setQuery, setSelected } = useSearch(
    state.history,
    setFocus
  );
  useEffect(() => {
    const cb = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      if (e.key === "Enter") {
        if (search.selected) setFocus(search.selected);
      } else if (e.key === "Escape") {
        clearQuery();
        document.getElementById("search")?.blur();
      } else if (!search.query && e.key.match(/^[A-Za-z0-9]$/)) {
        const el = document.getElementById("search");
        if (!el) return;
        setQuery(e.key);
        setTimeout(() => {
          el.focus();
        }, 1);
      }
    };
    window.addEventListener("keyup", cb);
    return () => {
      window.removeEventListener("keyup", cb);
    };
  }, [search, state.history]);

  useEffect(() => {
    const cb = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      if (e.key === "ArrowUp") {
        const i = search.selected
          ? search.results.findIndex((h) => h.name === search.selected)
          : 1;
        setSelected(search.results[Math.max(0, i - 1)]?.name);
      } else if (e.key === "ArrowDown") {
        const i = search.selected
          ? search.results.findIndex((h) => h.name === search.selected)
          : -1;
        setSelected(search.results[Math.max(0, i + 1)]?.name);
      }
    };
    window.addEventListener("keydown", cb);
    return () => {
      window.removeEventListener("keydown", cb);
    };
  }, [search.selected, search.results]);

  return (
    <div className={panelStyle}>
      <div className={navPanelStyle}>
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search browserverse..."
          value={search.query}
          onInput={(e) => setQuery(e.currentTarget.value.trim())}
          onFocus={(e) => {
            const el = e.currentTarget;
            function onKeyPress(e: KeyboardEvent) {
              if (e.key === "Enter") {
                if (search.results.length === 1)
                  setFocus(search.results[0].name); // will clear this search due to effect above
              } else if (e.key === "Escape") {
                // clear search and blur field
                el.blur();
                clearQuery();
              }
            }
            function cleanup() {
              setTimeout(clearQuery, 120);
              el.removeEventListener("blur", cleanup);
              el.removeEventListener("keypress", onKeyPress);
            }
            el.addEventListener("blur", cleanup);
            el.addEventListener("keypress", onKeyPress);
          }}
          className={searchInputStyle}
          autoComplete="off"
          style={!search.query ? { marginRight: 8 } : undefined}
        ></input>
        {search.query ? null : (
          <button
            className={`${constellationsButtonStyle} ${
              focus ? buttonSelectedStyle : ""
            }`}
            onClick={(e) => {
              e.stopImmediatePropagation();
              if (focus) setFocus(null);
              else setConstellation();
            }}
          >
            Constellations
            <svg
              className={buttonSvgStyle}
              stroke-width="0"
              viewBox="0 0 24 24"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M23 8c0 1.1-.9 2-2 2a1.7 1.7 0 01-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56A1.7 1.7 0 0119 8c0-1.1.9-2 2-2s2 .9 2 2z"></path>
            </svg>
          </button>
        )}
      </div>
      {search.query ? (
        <div className={searchPanelStyle}>
          {search.results.length !== 1 ? (
            <div className={searchStatsStyle}>
              <CloseButton onClick={() => setQuery("")} />
              <span style={{ marginLeft: 8 }}>
                {search.results.length} results
              </span>
            </div>
          ) : null}
          {search.results.length ? (
            <ul className={searchResultsStyle}>
              {search.results.map((r, i) => (
                <StarSearchResult
                  key={r.name}
                  selected={search.selected === r.name}
                  query={search.query}
                  star={r}
                  setFocus={setFocus}
                />
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
