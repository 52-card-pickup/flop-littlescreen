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
    let timeoutId: NodeJS.Timeout;

    async function fetchData() {
      try {
        const res = await client.GET(`/api/v1/player/{player_id}`, {
          params: {
            // @ts-expect-error: Unsure why the client doesn't accept this - but it works
            // as intended
            path: { player_id: playerDetails.id },
          },
          signal: abortController.signal,
        });
        if (res.response.status === 404) {
          setPlayerDetails({ name: playerDetails.name || "", id: "" });
        }
        if (res.data) setPlayerState(res.data);
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
        timeoutId = setTimeout(fetchData, 1000);
      }
    }

    fetchData();

    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [loading]);
}
