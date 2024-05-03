import { useState } from "react";
import FlopButton from "~/components/FlopButton";
import { client } from "~/flopClient";
import cn from "~/utils/cn";
import { useTimeoutState } from "~/hooks/useTimeoutState";
import usePlayerDetails from "~/hooks/usePlayerDetails";

export function WaitingRoom() {
  const [error, setError] = useTimeoutState(false, 1000);
  const [hasErrored, setHasErrored] = useState(false);
  const { playerDetails } = usePlayerDetails();

  return (
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
                  }
                });
            }}
          >
            Start Game
          </FlopButton>
        </div>
      </div>
    </div>
  );
}
