import { type MapStore } from "nanostores";
import { useStore } from "@nanostores/react";
import { useEffect, type ReactNode } from "react";

interface AstroReactContext<T = any> {
  store: MapStore;
  Provider: React.ComponentType<{ value: T; children: ReactNode }>;
}

export const useContext = (ctx: AstroReactContext) => {
  console.log("getting store value", ctx.store.get());
  return useStore(ctx.store);
};

/**
 * Differences with React:
 * - We need to initialize the context value when mounting the provider,
 * using an effect
 * - The store is a singleton: using the same context provider twice will share the same store!
 * While in React you have one context per provider
 * @param store
 * @returns
 */
function makeContextProvider<T = any>(store: MapStore) {
  return function ContextProvider<T>({
    value,
    children,
  }: {
    value: T;
    children: React.ReactNode;
  }) {
    store.set(value);

    useEffect(() => {
      console.log("setting store initial value", value);
      store.set(value);
    }, []);

    return <>{children}</>;
  };
}

export function createContext<T extends object>(
  defaultCtx: T,
  store: MapStore
): AstroReactContext {
  store.set(defaultCtx);
  return {
    store,
    Provider: makeContextProvider<T>(store),
  };
}
