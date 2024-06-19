import * as Baitshop from "baitshop/preact";

interface FocusObject {}

interface FocusProps {}

interface FocusState {
  focus: null | FocusObject;
}

interface FocusActions {
  setFocus(focus: FocusObject): void;
  endFocus(): void;
}

class Focus extends Baitshop.Hook<FocusProps, FocusState, FocusActions> {
  getInitialState() {
    return { focus: null };
  }

  getActions() {
    return {
      setFocus: this.setFocus.bind(this),
      endFocus: this.endFocus.bind(this),
    };
  }

  setFocus(focus: FocusObject) {
    this.setState({ focus });
  }

  endFocus() {
    this.setState({ focus: null });
  }
}

const [Provider, useFocus] = Baitshop.createSharedHook(Focus);
export const FocusProvider = Provider;
export default useFocus;
