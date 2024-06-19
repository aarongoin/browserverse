import * as Baitshop from "baitshop/preact";
import { OriginPoint } from "../types/orbital";

interface OrbitalProps {
  origin: OriginPoint;
  radius: number | ((theta: number) => number);
  theta: number;
  offset: number; // offset from theta
}

interface OrbitalState {
  left: number;
  top: number;
}

const rad360 = Math.PI * 2;

class Orbital extends Baitshop.Hook<OrbitalProps, OrbitalState> {
  getInitialState() {
    return { left: 0, top: 0 };
  }

  didPropsChange(prevProps: OrbitalProps) {
    return this.props.theta !== prevProps.theta;
  }

  cartesianFromPolarCoords(): void {
    const { origin, radius, theta, offset } = this.props;
    const t = (theta + offset) % rad360;
    const r = typeof radius === "number" ? radius : radius(t);
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    this.setState({ left: x + origin.x, top: y + origin.y });
  }
}

const useOrbital = Baitshop.createHook(Orbital);

export default useOrbital;
