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
    if (!playerDetails.id) return;
    const abortController = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastUpdate: number | null = null;
    console.info("Starting player polling");

    function cancel() {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      try {
        abortController.abort();
      } catch (error) {
        console.info("Failed to abort fetch:", error);
      }
    }

    async function fetchData() {
      const before = Date.now();
      try {
        const res = await client.GET(`/api/v1/player/{player_id}`, {
          params: {
            path: { player_id: playerDetails.id },
            query:
              lastUpdate === null
                ? {}
                : {
                    timeout: "15000",
                    since: lastUpdate,
                  },
          },
          signal: abortController.signal,
        });
        if (res.response.status === 404) {
          setPlayerDetails({ name: playerDetails.name || "", id: "" });
        }
        if (res.data) {
          setPlayerState(res.data);
          lastUpdate = res.data.lastUpdate;
          console.info("Player state updated, lastUpdate:", lastUpdate);
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            console.info("Fetch aborted");
            return;
          }
          if (error instanceof Response && error.status === 404) {
            console.error("Player not found");
            setPlayerDetails({ name: playerDetails.name || "", id: "" });
            return;
          }
          console.error("Failed to fetch data:", error);
          setPlayerState((prevState) => ({ ...prevState, state: "offline" }));
        } else {
          console.error("An unknown error occurred");
        }
      }
      const elapsed = Date.now() - before;
      const delay = Math.max(0, 1000 - elapsed);
      console.info("Polling delay:", delay);
      timeoutId = setTimeout(fetchData, delay);
    }

    fetchData();

    return () => {
      cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, playerDetails.id]);
}
