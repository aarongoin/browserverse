import Preact, { h } from "preact";
import { OriginPoint } from "../types/orbital";
import useOrbital from "../hooks/useOrbital";
import useFocus from "../hooks/useFocus";

interface OrbitalBody {
  id: string;
  getOrigin(): OriginPoint;
}

interface PlanetProps {
  body: OrbitalBody;
  parent: OrbitalBody;
  color: number; // number between 0 and 355 inclusively (0,5,10,15...355)
  d: number;
  children?: Preact.VNode;
}

export function Planet(props: PlanetProps): Preact.VNode {
  const position = useOrbital({
    origin: props.parent.getOrigin(),
    theta: 0,
    offset: 0,
    radius: 50,
  });
  const { setFocus } = useFocus();
  return (
    <div
      class={`body color-${props.color}`}
      style={{ ...position, width: props.d, height: props.d }}
      onClick={() => setFocus(props.body)}
    >
      {props.children}
    </div>
  );
}
