import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { client } from "~/flopClient";
import { devState, playerState } from "~/state";
import usePlayerDetails from "./usePlayerDetails";

export function usePlayerPolling() {
  const setPlayerState = useSetRecoilState(playerState);
  const { setPlayerDetails } = usePlayerDetails();
  const { playerDetails, loading } = usePlayerDetails();
  const [dev] = useRecoilState(devState);

  useEffect(() => {
    if (dev.showSwitchboard) return;
    if (loading) return;
    const abortController = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastUpdate: number | null = null;

    async function fetchData() {
      const before = Date.now();
      try {
        const res = await client.GET(`/api/v1/player/{player_id}`, {
          params: {
            // @ts-expect-error: Unsure why the client doesn't accept this - but it works
            // as intended
            path: { player_id: playerDetails.id },
          },
          query: lastUpdate === null ? {} : {
            timeout: "15000",
            since: lastUpdate,
          },
          signal: abortController.signal,
        });
        if (res.response.status === 404) {
          setPlayerDetails({ name: playerDetails.name || "", id: "" });
        }
        if (res.data) {
          setPlayerState(res.data);
          lastUpdate = res.data.lastUpdate;
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            console.error("Fetch aborted");
            if (error instanceof Response && error.status === 404) {
              console.error("Player not found");
              setPlayerDetails({ name: playerDetails.name || "", id: "" });
            }
          } else {
            console.error("Failed to fetch data:", error);
            setPlayerState((prevState) => ({ ...prevState, state: "offline" }));
          }
        } else {
          console.error("An unknown error occurred");
        }
      } finally {
        const elapsed = Date.now() - before;
        const delay = Math.max(0, 1000 - elapsed);
        timeoutId = setTimeout(fetchData, delay);
      }
    }

    fetchData();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      abortController.abort();
    };
  }, [loading]);
}
