import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import FlopButton from "~/components/FlopButton";
import GameScreen from "~/components/GameScreen";
import { client } from "~/flopClient";
import { useGoogleCastContext } from "~/hooks/cast_sender/useGoogleCastContext";
import usePlayerDetails from "~/hooks/usePlayerDetails";
import { usePlayerPolling } from "~/hooks/usePlayerPolling";
import { playerState } from "~/state";
import cn from "~/utils/cn";
import { GoogleCastButton } from "../components/GoogleCastButton";

export default function Game() {
  usePlayerPolling();
  useGoogleCastContext();

  const [player] = useRecoilState(playerState);
  const { playerDetails, loading } = usePlayerDetails();

  const [error, setError] = useState(false);
  const [hasErrored, setHasErrored] = useState(false);

  const navigate = useNavigate();

  const showStartGameButton =
    player.state === "waiting" || player.state === "offline";

  useEffect(() => {
    if (
      !loading &&
      (!playerDetails || !playerDetails.id || playerDetails.id === "")
    ) {
      navigate("/");
    }
  }, [loading, playerDetails, navigate]);

  useEffect(() => {
    if (!error) return;

    let handle: ReturnType<typeof setTimeout> | null = null;
    handle = setTimeout(() => {
      setError(false);
      handle = null;
    }, 1000);

    setHasErrored(true);

    return () => {
      if (handle) {
        clearTimeout(handle);
        setError(false);
      }
    };
  }, [error]);

  if (showStartGameButton) {
    return (
      <div
        className="min-h-screen grid grid-flow-row grid-rows-[1fr,1fr,1fr,1fr] 
      text-white place-self-center bg-slate-200"
      >
        <GoogleCastButton className="fixed top-8 right-8 w-8 h-8" />
        <div className={cn("grid justify-center items-center h-screen")}>
          <div className={cn("flex flex-col justify-center items-center")}>
            {hasErrored && (
              <div className="py-10 animate-pulse">
                <h2 className="text-black font-bold text-2xl p-2 text-center">
                  Failed to start game
                </h2>
                <p className="text-black text-center">
                  Please try again in a moment
                </p>
              </div>
            )}
            <div className={cn(error ? "animate-shake" : "")}>
              <FlopButton
                onClick={() => {
                  setHasErrored(false);
                  client
                    .POST("/api/v1/room/close")
                    .catch((e) => {
                      console.error(e);
                      return { error: e };
                    })
                    .then((x) => {
                      if (x.error) {
                        console.warn("error starting game");
                        setError(true);
                      }
                    });
                }}
              >
                Start Game
              </FlopButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden">
      <GameScreen
        state={player}
        actions={{
          fold: () => {
            client.POST("/api/v1/play", {
              body: {
                action: "fold",
                playerId: playerDetails.id,
                stake: 0, // placeholder
              },
            });
          },
          raiseTo: (stake: number) => {
            client.POST("/api/v1/play", {
              body: {
                action: "raiseTo",
                stake: stake,
                playerId: playerDetails.id,
              },
            });
          },
          check: () => {
            client.POST("/api/v1/play", {
              body: {
                action: "check",
                playerId: playerDetails.id,
                stake: 0, // placeholder
              },
            });
          },
          call: () => {
            client.POST("/api/v1/play", {
              body: {
                action: "call",
                playerId: playerDetails.id,
                stake: 0, // placeholder
              },
            });
          },
        }}
      />
      <GoogleCastButton className="fixed top-8 right-8 w-8 h-8" />
    </div>
  );
}
