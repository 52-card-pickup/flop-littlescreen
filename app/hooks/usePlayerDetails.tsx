import { useSearchParams } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { PlayerDetails, playerDetailsState } from "~/state";

const LOCAL_STORAGE_VERSION = "2.1";

interface StorageValue<T> {
  version: string;
  states: {
    key: string;
    value: T;
  }[];
  default?: {
    key: string;
    value: T;
  };
}

// a hook which hides getting and setting of playerDetails behind a localstorage cache
export default function usePlayerDetails() {
  const [playerDetails, setPlayerDetailsRecoilState] =
    useRecoilState(playerDetailsState);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const searchReset = searchParams.has("reset");
  const searchZ = searchParams.get("z");

  useEffect(() => {
    try {
      if (searchReset) return;

      const z = searchZ ?? sessionStorage.getItem("z") ?? undefined;
      const state = getPersistentState(z);
      if (!state) return;

      setPlayerDetailsRecoilState(state);
    } finally {
      setLoading(false);
    }
  }, [setPlayerDetailsRecoilState, searchReset, searchZ]);

  const setPlayerDetails = useCallback(
    function setPlayerDetails(newPlayerDetails: PlayerDetails) {
      const z = searchZ ?? sessionStorage.getItem("z") ?? undefined;
      setPersistentState(newPlayerDetails, z);
      setPlayerDetailsRecoilState(newPlayerDetails);
    },
    [setPlayerDetailsRecoilState, searchZ]
  );

  const setCurrentDetailsToDefault = useCallback(
    function setCurrentDetailsDefault() {
      setPersistentState(playerDetails);
    },
    [playerDetails.id, playerDetails.name]
  );

  return {
    playerDetails,
    setPlayerDetails,
    setCurrentDetailsToDefault,
    loading,
  };
}

function getPersistentState(
  key: string = "default"
): { id: string; name: string } | null {
  if (!window.localStorage) return null;

  try {
    const saved = window.localStorage.getItem("playerDetails");
    const state: StorageValue<any> | undefined = saved && JSON.parse(saved);
    if (state && "states" in state) {
      const obj = state.states.find((s: { key: string }) => s.key === key);
      const value = obj?.value;
      return typeof value === "object" && "id" in value && "name" in value
        ? value
        : state.default?.value ?? null;
    }
    return null;
  } catch {
    return null;
  }
}

function setPersistentState<T>(payload: T, key: string = "default") {
  if (!window.localStorage) return;

  function get() {
    const saved = window.localStorage.getItem("playerDetails");
    if (!saved) return null;
    return JSON.parse(saved);
  }

  try {
    const state = get() || {};

    if (
      !state ||
      typeof state !== "object" ||
      state.version !== LOCAL_STORAGE_VERSION ||
      !Array.isArray(state.states)
    ) {
      window.localStorage.setItem(
        "playerDetails",
        JSON.stringify({
          version: LOCAL_STORAGE_VERSION,
          states: [{ key, value: payload }],
        } satisfies StorageValue<T>)
      );
      return;
    }

    const states: { key: string; value: T }[] = [...state.states];
    states.push({ key, value: payload });

    states.splice(0, states.length - 5); // keep only the last 5 states

    state.states = states;
    window.localStorage.setItem("playerDetails", JSON.stringify(state));
  } catch {
    return null;
  }
}
