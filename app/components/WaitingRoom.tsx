import { useState } from "react";
import FlopButton from "~/components/FlopButton";
import { client } from "~/flopClient";
import cn from "~/utils/cn";
import { useTimeoutState } from "~/hooks/useTimeoutState";
import usePlayerDetails from "~/hooks/usePlayerDetails";
import { useVibrate } from "~/hooks/useVibrate";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

export function WaitingRoom() {
  const [error, setError] = useTimeoutState(false, 1000);
  const [hasErrored, setHasErrored] = useState(false);
  const { playerDetails } = usePlayerDetails();
  const failedToJoinVibrate = useVibrate([5, 150, 10, 150, 5, 150, 10], 50);

  return (
    <div className="grid justify-center items-center pb-32 gap-8 relative">
      <div className="flex flex-col justify-center items-center gap-6">
        <div className="flex flex-col h-20 w-full justify-end">
          {hasErrored ? (
            <>
              <h2 className="text-watercourse-950 font-semibold text-2xl p-2 text-center animate-pulse">
                your room is not ready yet
              </h2>
              <p className="text-watercourse-900 text-center">
                has everyone joined?
              </p>
            </>
          ) : (
            playerDetails?.name && (
              <h2 className="text-watercourse-900 font-medium text-xl text-center">
                {playerDetails.name}, you're in the waiting room
              </h2>
            )
          )}
        </div>
        <div className={cn(error ? "animate-shake" : "")}>
          <FlopButton
            color="watercourse"
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
            Everyone's here
          </FlopButton>
        </div>
      </div>
    </div>
  );
}
