import { useDocument } from "./useDocument";

const defaultPath = "https://tv.flop.party";
const betaPath = "https://beta.flop.party/big-screen";

export function useBigScreenUrl(roomCode?: string | null) {
  const document = useDocument();
  const location = document?.location;
  const url = resolveBigScreenPath(location ?? null);

  const bigScreenUrl = roomCode ? `${url}/${roomCode}` : url;

  const bigScreenUrlObject = new URL(bigScreenUrl);
  return {
    url: bigScreenUrlObject,
    displayUrl: stripSchemeFromUrl(bigScreenUrlObject),
  };
}

function stripSchemeFromUrl(bigScreenUrl: URL) {
  return bigScreenUrl.pathname === "/"
    ? bigScreenUrl.hostname
    : bigScreenUrl.hostname + bigScreenUrl.pathname;
}

function resolveBigScreenPath(location: Location | null) {
  if (!location) {
    return defaultPath;
  }
  if (location.host.startsWith("beta.")) {
    return betaPath;
  }
  if (location.host.split(":")[0] === "localhost") {
    return `${location.origin}/big-screen`;
  }

  return defaultPath;
}
