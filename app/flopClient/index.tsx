import type { paths } from "~/flopClient/spec";
import createClient from "openapi-fetch";

export const client = createClient<paths>({
  baseUrl: globalThis.ENV?.API_URL || "/",
});
