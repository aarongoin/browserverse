import * as Baitshop from "baitshop";

interface MouseHookProps {
  throttle: number;
}

interface MouseHookState {
  x: number;
  y: number;
  dx: number;
  dy: number;
  moved: boolean;
}

class MouseHook extends Baitshop.Hook<MouseHookProps, MouseHookState> {
  positionThrottle: null | number = null;
  mouseX: number = 0;
  mouseY: number = 0;

  getInitialState() {
    return {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      moved: false,
    };
  }

  onMount() {
    window.addEventListener("mousemove", this);
    window.addEventListener("mouseenter", this);
    window.addEventListener("mouseleave", this);
    window.setInterval(this.recordMousePosition, this.props.throttle);
  }

  onUnmount() {
    window.removeEventListener("mousemove", this);
    window.removeEventListener("mouseenter", this);
    window.removeEventListener("mouseleave", this);
    if (this.positionThrottle) window.clearInterval(this.positionThrottle);
  }

  handleEvent(event: MouseEvent) {
    if (event.type === "mousemove") {
      this.mouseX = event.x;
      this.mouseY = event.y;
    } else if (event.type === "mouseenter") {
      if (!this.positionThrottle)
        this.positionThrottle = window.setInterval(
          this.recordMousePosition,
          this.props.throttle
        );
    } else if (event.type === "mouseleave") {
      if (this.positionThrottle) {
        window.clearInterval(this.positionThrottle);
        this.positionThrottle = null;
      }
    }
  }

  didPropsChange() {
    return false;
  }

  didStateChange() {
    return this.state.moved;
  }

  recordMousePosition = () => {
    const { x, y } = this.state;
    // TODO: is this truncation necessary? Not necessary to truncate if both values are integers.
    const dx = Math.trunc(this.mouseX - x);
    const dy = Math.trunc(this.mouseY - y);
    this.setState({
      x: this.mouseX,
      y: this.mouseY,
      dx,
      dy,
      moved: !!(dx + dy),
    });
  };
}

const [Provider, useMouse] = Baitshop.createSharedHook(MouseHook);
export const MouseProvider = Provider;
export default useMouse;
