import { useRef, useState } from "preact/hooks";

type Consumer<C extends Record<string, unknown>> = (context: C) => unknown;

interface Context<C extends Record<string, unknown>> {
  context: C;
  consumers: Consumer<C>[];
}

export default function createContext<C extends Record<string, unknown>>() {
  const providers: Context<C>[] = [];
  function useProvider(context: C) {
    const state = useRef({
      context,
      consumers: [],
    });
    providers.push(state.current);
    if (state.current.context !== context) {
      state.current.context = context;
      state.current.consumers.forEach((selector: Consumer<C>) =>
        selector(context)
      );
    }
    return ({ children }: { children: unknown }) => {
      providers.pop();
      return children;
    };
  }
  function useConsumer(selector: Consumer<C>) {
    const provider = useRef<null | Context<C>>(null);
    const [state, setState] = useState(
      provider.current
        ? null
        : selector(providers[providers.length - 1].context)
    );
    if (!provider.current) {
      provider.current = providers[providers.length - 1];
      provider.current.consumers.unshift((context) =>
        setState(selector(context))
      );
    }
    return state;
  }
  return {
    useProvider,
    useConsumer,
  };
}
