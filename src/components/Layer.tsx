import Preact, { h } from "preact";

interface LayerProps<I> {
  visible: boolean;
  Cmp: Preact.ComponentType<{ item: I }>;
  items: I[];
}

export default function Layer<I>({
  visible,
  Cmp,
  items,
}: LayerProps<I>): Preact.VNode {
  return (
    <div class={`layer ${visible ? "visible" : "hidden"}`}>
      {items.map((item) => (
        <Cmp item={item} />
      ))}
    </div>
  );
}
/*

Layers:
Background
Navigation
Planets
Focus

*/
