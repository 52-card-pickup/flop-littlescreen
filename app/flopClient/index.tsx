import type { paths } from "~/flopClient/spec";
import createClient from "openapi-fetch";

type FlopClientState = {
  client: ReturnType<typeof createClient<paths>> | null;
  isInitialized: () => boolean;
};

const state: FlopClientState = {
  client: null,
  isInitialized: () => state.client !== null,
};

export function tryInitializeClient(
  env: { API_URL: string | null } = globalThis.ENV
) {
  if (state.isInitialized()) {
    return;
  }

  const client = createClient<paths>({
    baseUrl: env?.API_URL ?? undefined,
  });

  state.client = client;
}

export function useClient() {
  if (!state.client) {
    throw new Error("Client not initialized");
  }
  return { client: state.client };
}
