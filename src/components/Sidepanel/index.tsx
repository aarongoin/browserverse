import { h } from "preact";
import { ConstellationsPanel } from "./ConstellationsPanel";
import { FocusedStarPanel } from "./FocusedStarPanel";
import { StarSearchPanel } from "./StarSearchPanel";
import { Fortune } from "./Fortune";

type SidepanelProps = {};

export function Sidepanel({
  state,
  focus,
  setFocus,
  setConstellation,
}: SidepanelProps) {
  if (focus?.startsWith("constellation_"))
    return (
      <ConstellationsPanel
        constellations={state.constellations}
        focus={focus}
        setFocus={setFocus}
      />
    );
  const focusedItem = (focus && state.history[focus]) || null;
  if (focusedItem)
    return <FocusedStarPanel star={focusedItem} setFocus={setFocus} />;
  return [
    <Fortune fortune={state.fortune} />,
    <StarSearchPanel
      state={state}
      focus={focus}
      setFocus={setFocus}
      setConstellation={setConstellation}
    />,
  ];
}
