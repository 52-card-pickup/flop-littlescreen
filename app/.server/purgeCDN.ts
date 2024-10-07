import { safeEnv } from "~/utils/safeEnv";

export async function purgeCDN() {
  const cloudflareToken = safeEnv("CLOUDFLARE_API_TOKEN");
  if (!cloudflareToken) {
    console.info("Missing CLOUDFLARE_API_TOKEN, skipping CDN purge");
    return;
  }
  const urls = {
    BETA_HOME: "https://beta.flop.party/",
    PROD_HOME: "https://flop.party/",
  };

  const envPurgeKeysCsv = safeEnv("CLOUDFLARE_PURGE_KEYS");
  const envPurgeKeys = envPurgeKeysCsv
    ? envPurgeKeysCsv.split(",").map((key) => key.trim())
    : ["BETA_HOME"];

  const purgeKeys = envPurgeKeys.flatMap((key) =>
    key in urls ? [key as keyof typeof urls] : []
  );

  const zoneId = "b8798b2dc2a7dc45852d3f58242abdbe";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + cloudflareToken,
    },
    body: JSON.stringify({
      files: purgeKeys.map((key) => urls[key]),
    }),
  };

  const success = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      if (!response.success) {
        return Promise.reject(response);
      }

      console.log(
        `Purged Cloudflare cache for paths: ${purgeKeys.join(", ")}`,
        response
      );

      return true;
    })
    .catch((err) => {
      console.error(
        `Failed to purge Cloudflare cache for paths: ${purgeKeys.join(", ")}`,
        err
      );

      return false;
    });

  if (!success) {
    return;
  }

  for (const key of purgeKeys) {
    console.log(`Populating cache for ${key} @ ${urls[key]}`);
    const success = await refreshCache(urls, key);
    if (!success) {
      console.error(`Failed to populate cache for ${key} @ ${urls[key]}`);
      continue;
    }

    console.log(`Successfully populated cache for ${key} @ ${urls[key]}`);
  }
}
async function refreshCache<T extends string>(urls: Record<T, string>, key: T) {
  let attempts = 0;
  while (attempts < 5) {
    const cacheStatus = await fetch(urls[key])
      .then((response) => {
        if (!response.ok) {
          console.error(`Failed to populate cache for ${key} @ ${urls[key]}`);
          return null;
        }

        const cacheStatusHeader = response.headers.get("cf-cache-status");
        console.log(
          `Purged cache for ${key} @ ${urls[key]} (response: ${cacheStatusHeader})`
        );

        return cacheStatusHeader;
      })
      .catch((err) => {
        console.error(
          `Failed to populate cache for ${key} @ ${urls[key]}`,
          err
        );
        return null;
      });

    if (cacheStatus === "HIT") {
      return true;
    }

    attempts++;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return false;
}
