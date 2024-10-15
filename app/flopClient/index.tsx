import type { paths } from "~/flopClient/spec";
import createClient from "openapi-fetch";

export const client = createClient<paths>({
  baseUrl: import.meta.env.DEV ? "http://localhost:8080/" : "/",
});
