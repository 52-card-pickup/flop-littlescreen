import { useState } from "react";
import FlopButton from "~/components/FlopButton";
import { client } from "~/flopClient";
import { GoogleCastButton } from "./GoogleCastButton";
import cn from "~/utils/cn";
import { PlayerPhotoCamera } from "./PlayerPhotoCamera";
import { useTimeoutState } from "~/hooks/useTimeoutState";
import usePlayerDetails from "~/hooks/usePlayerDetails";
import { useVibrate } from "~/hooks/useVibrate";

export function WaitingRoom() {
  const [error, setError] = useTimeoutState(false, 1000);
  const [hasErrored, setHasErrored] = useState(false);
  const { playerDetails } = usePlayerDetails();
  const failedToJoinVibrate = useVibrate([5, 150, 10, 150, 5, 150, 10], 50);

  return (
    <div
      className="max-h-screen grid grid-flow-row grid-rows-[1fr,1fr,1fr,1fr] 
text-white place-self-center bg-slate-200"
    >
      <GoogleCastButton className="fixed top-8 right-8 w-8 h-8" />
      <div className={cn("grid justify-center items-center h-screen")}>
        <div className={cn("flex flex-col justify-center items-center")}>
          {hasErrored && (
            <div className="py-10">
              <h2 className="text-slate-800 font-bold text-2xl px-8 text-center">
                The room is not ready to start the game
              </h2>
              <p className="text-slate-600 text-center py-4 animate-pulse">
                Please try again in a moment
              </p>
            </div>
          )}
          <div className="grid justify-center items-center">
            <h2 className="text-black font-bold text-2xl p-6 text-center">
              Hello {playerDetails.name}, welcome to flop!
            </h2>
          </div>
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
                      setHasErrored(true);
                      failedToJoinVibrate();
                    }
                  });
              }}
            >
              Start Game
            </FlopButton>
          </div>
        </div>
      </div>
      <div className="fixed left-0 bottom-8 w-full grid justify-center items-center">
        <PlayerPhotoCamera className="m-8" />
      </div>
    </div>
  );
}
