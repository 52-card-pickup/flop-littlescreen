import type { paths } from "~/flopClient/spec";
import createClient from "openapi-fetch";

export const client = createClient<paths>({
  baseUrl: "http://127.0.0.1:5000",
});
