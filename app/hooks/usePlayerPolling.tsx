import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { client } from "~/flopClient";
import { playerDetailsState, playerState } from "~/state";

export function usePlayerPolling() {
  const setPlayerState = useSetRecoilState(playerState);
  const setPlayerDetails = useSetRecoilState(playerDetailsState);
  const [playerDetails] = useRecoilState(playerDetailsState);
  useEffect(() => {
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
        if (res.data) {
          setPlayerState(res.data);
        }
      } catch (error) {
        console.dir(error);
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            console.error("Fetch aborted");
            if (error instanceof Response && error.status === 404) {
              console.error("Player not found");
              setPlayerDetails((prevState) => ({ ...prevState, id: "" }));
            }
          } else {
            console.error("Failed to fetch data:", error);
            setPlayerState((prevState) => ({ ...prevState, state: "offline" }));
          }
        } else {
          console.error("An unknown error occurred");
        }
      } finally {
        timeoutId = setTimeout(fetchData, 6000);
      }
    }

    fetchData();

    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, []);
}
