import type { paths } from "~/flopClient/spec";
import createClient from "openapi-fetch";

type FlopClientState = {
  client: ReturnType<typeof createClient<paths>>;
  setClient: (client: ReturnType<typeof createClient<paths>>) => void;
  isInitialized: () => boolean;
};

const state = init();

function init(): FlopClientState {
  let resolve: (() => void) | undefined = undefined;
  const promise = new Promise<void>((r) => {
    resolve = r;
  });

  let clientState: ReturnType<typeof createClient<paths>> | null = null;

  const flopClientState: FlopClientState = {
    setClient(client: ReturnType<typeof createClient<paths>>) {
      clientState = client;
      resolve?.();
      resolve = undefined;
    },
    client: clientState!,
    isInitialized: () => !!clientState,
  };

  const clientProxy = new Proxy({} as ReturnType<typeof createClient<paths>>, {
    get(target, prop) {
      if (!clientState) {
        return async (...args: any[]) => {
          await promise;
          if (!clientState) {
            throw new Error("Client not initialized");
          }

          return Reflect.get(clientState, prop)(...args);
        };
      }

      return Reflect.get(clientState, prop);
    },
    set() {
      throw new Error("Client cannot be modified");
    },
  });

  flopClientState.client = clientProxy;
  return flopClientState;
}

export function tryInitializeClient(
  env: { API_URL: string | null } = globalThis.ENV
) {
  if (state.isInitialized()) {
    return;
  }

  const client = createClient<paths>({
    baseUrl: env?.API_URL ?? undefined,
  });

  state.setClient(client);
}

export const client = state.client;
