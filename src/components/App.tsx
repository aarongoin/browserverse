import { h } from "preact";
import { useState, useEffect, useMemo } from "preact/hooks";
import {
  getFullHistoryBetween,
  mergeDomainItems,
  StarClassT,
} from "../services/history";
import { throttle } from "../utils/debounce";
import { QuadTree } from "../utils/QuadTree";
import { appStyle } from "./App.css";
import { CosmicBackground } from "./CosmicBackground";
import { Scryglass } from "./Scryglass";
import { SpaceLayer } from "./SpaceLayer";
import { Starmap } from "./Starmap";
import { Sidepanel } from "./Sidepanel";
import { FocusRing } from "./FocusRing";
import clamp from "../utils/clamp";
import { BuyMeACoffeeButton } from "./Sidepanel/BuyMeACoffeeButton";
import { ConstellationMap } from "./ConstellationMap";
import {
  createConstellation,
  getConstellations,
  renameConstellation,
  trimConstellations,
} from "../services/constellation";
import { weekdayMonthDayYear } from "./Sidepanel/FocusedStarPanel";
import { getDailyBrowserverseFortune } from "../services/fortune";
import { AstralSign } from "./AstralSign";

if ((module as any).hot) {
  // tslint:disable-next-line:no-var-requires
  require("preact/debug");
}

let _state = {
  history: {},
  hosts: 0,
  visits: 0,
  names: [],
  max_results: 2_147_483_647,
  start_time: 0,
  end_time: 0,
  days: 0,
  constellations: [],
  fortune: "",
  initialized: false,
};
const getState = () => _state;
const noop = () => null;
let _setState = noop;

function updateDomainState(update) {
  const days = _state.days + update.days;
  const history = mergeDomainItems(_state.history, update.history, days);
  let names = Object.keys(history).sort((a, b) =>
    history[a].visit_days > history[b].visit_days
      ? -1
      : history[a].visit_days < history[b].visit_days
      ? 1
      : 0
  );

  // calculate star class and diameter
  for (const h of names) {
    const star = history[h];
    star.d =
      h !== "browserverse.cloud" ? clamp(star.visit_days * 4, 2, 16) : 16;
  }

  _state = {
    history,
    hosts: names.length,
    visits: names.reduce((sum, h) => sum + history[h].visits, 0),
    names,
    start_time: Math.max(_state.start_time, update.start_time),
    end_time: 0,
    days,
    constellations: _state.constellations || [],
    fortune: _state.fortune || "",
  };
  _setState(_state);
}
Promise.all([
  getFullHistoryBetween(1, 0).then((update) => {
    updateDomainState(update);
    return createConstellation(update.names, update.history, false);
  }), // 1
  getFullHistoryBetween(2, 1).then(updateDomainState), // 1
  getFullHistoryBetween(4, 2).then(updateDomainState), // 2
  getFullHistoryBetween(8, 4).then(updateDomainState), // 4
  getFullHistoryBetween(16, 8).then(updateDomainState), // 8
  getFullHistoryBetween(32, 16).then(updateDomainState), // 16
  getFullHistoryBetween(64, 32).then(updateDomainState), // 32
  getFullHistoryBetween(90, 64)
    .then(updateDomainState)
    .then(() => {
      const { names, history } = getState();
      return createConstellation(names, history);
    }), // 26
])
  .then(() =>
    trimConstellations()
      .then(getConstellations)
      .then((constellations) => {
        _state = {
          ...getState(),
          constellations: Array.from(Object.values(constellations)).sort(
            (a, b) => a.date - b.date
          ),
          initialized: true,
        };
        _setState(_state);
        return constellations;
      })
  )
  .then((constellations) =>
    getDailyBrowserverseFortune(
      // pull out the latest constellation of stars to use for our fortune
      // The first star is always "browserverse.cloud" which we want in the UI, but not in the fortune
      constellations[Date.parse(weekdayMonthDayYear(new Date()))].stars
        .map((s) => s.name)
        .slice(1)
    ).then((fortune) =>
      // use the generated sign to name the constellation
      renameConstellation(fortune.date, fortune.sign).then(
        (updated_constellations) =>
          _setState({
            ...getState(),
            constellations: Array.from(
              Object.values(updated_constellations)
            ).sort((a, b) => a.date - b.date),
            fortune: fortune.fortune,
          })
      )
    )
  );

export default function App() {
  const [state, setState] = useState(_state);

  useEffect(() => {
    _setState = setState;
    if (_state !== state) {
      setTimeout(setState, 0, _state);
    }
    return () => {
      _setState = noop;
    };
  }, []);

  const [[width, height], setDims] = useState([
    window.innerWidth - 200,
    window.innerHeight - 80,
  ]);
  useEffect(() => {
    const cb = throttle(
      () => setDims([window.innerWidth - 200, window.innerHeight - 80]),
      16,
      {}
    );
    window.addEventListener("resize", cb);
    return () => {
      window.removeEventListener("resize", cb);
    };
  }, []);

  const dim = Math.min(height, width) / 2;
  const offset = Math.max(height, width) / 2 - dim;

  const tree = useMemo(() => {
    const _tree = QuadTree([0, 0, width, height], 100);
    const { history, names } = state;
    for (const h of names)
      _tree.add(history[h].x * dim + dim + offset, history[h].y * dim + dim, h);
    return _tree;
  }, [state, width, height]);

  const [focus, setFocus] = useState<string | null>(null);

  const constellationView = focus?.startsWith("constellation");
  const [constellationTree, constellationHistory] = useMemo(() => {
    if (!constellationView) return [null, null];
    const id = focus?.split("_")[1];
    if (!id) return null;
    const constellation = state.constellations.find((c) => c.date == id);
    const stars = constellation?.stars || [];
    const constellationHistory = {};
    for (const s of stars) constellationHistory[s.name] = s;
    return [
      {
        getDataInBounds() {
          return stars.map((s) => s.name);
        },
      },
      constellationHistory,
    ];
  }, [focus, constellationView, state]);

  if (!state.initialized)
    return (
      <main className={appStyle}>
        <CosmicBackground width={width + 200} height={height + 80} />
        <SpaceLayer width={width} height={height} setFocus={setFocus}>
          <Starmap
            history={state.history}
            names={state.names}
            dim={dim}
            offset={offset}
          />
        </SpaceLayer>
      </main>
    );

  return (
    <main className={appStyle} onClick={() => setFocus(null)}>
      <CosmicBackground width={width + 200} height={height + 80} />
      <SpaceLayer width={width} height={height}>
        <Starmap
          history={state.history}
          names={state.names}
          dim={dim}
          offset={offset}
        />
        <ConstellationMap
          key={focus}
          visible={!!(constellationView && state.names.length)}
          history={constellationHistory}
          names={constellationTree?.getDataInBounds() || []}
          dim={dim}
          offset={offset}
        />
        <Scryglass
          node={constellationView ? constellationTree : tree}
          history={state.history}
          dim={dim}
          offset={offset}
          setFocus={setFocus}
        />
        {constellationView ? null : (
          <FocusRing
            focus={focus}
            history={state.history}
            dim={dim}
            offset={offset}
          />
        )}
      </SpaceLayer>
      <Sidepanel
        state={state}
        focus={focus}
        setFocus={setFocus}
        setConstellation={() =>
          setFocus(`constellation_${state.constellations[0]?.date}`)
        }
      />
      <AstralSign sign={state.fortune?.sign} />
      <BuyMeACoffeeButton />
    </main>
  );
}
