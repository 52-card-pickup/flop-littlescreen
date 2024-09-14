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
  const [hasErrored, setHasErrored] = useTimeoutState(false, 5000);
  const { playerDetails } = usePlayerDetails();
  const failedToJoinVibrate = useVibrate([5, 150, 10, 150, 5, 150, 10], 50);

  return (
    <div className="grid justify-center items-center pb-32 gap-8 relative">
      <div className="flex flex-col justify-center items-center gap-6">
        <div className="flex flex-col h-28 w-full justify-end">
          {hasErrored ? (
            <>
              <h2 className="text-watercourse-950 font-semibold text-2xl p-2 text-center animate-pulse">
                {playerDetails.roomCode
                  ? `room ${playerDetails.roomCode} is not ready yet`
                  : "your room is not ready yet"}
              </h2>
              <p className="text-watercourse-900 text-center">
                has everyone joined?
              </p>
            </>
          ) : (
            playerDetails?.name && (
              <>
                <h2 className="text-watercourse-900 font-medium text-xl text-center px-12">
                  <span className="text-watercourse-800 font-semibold">
                    {playerDetails.name},
                  </span>{" "}
                  you're in the waiting room
                  {playerDetails.roomCode ? " for room: " : "."}
                </h2>
                {playerDetails.roomCode && (
                  <h2 className="text-watercourse-950 font-semibold text-2xl p-2 text-center animate-pulse">
                    {playerDetails.roomCode}
                  </h2>
                )}
              </>
            )
          )}
        </div>
        <div className={cn(error ? "animate-shake" : "")}>
          <FlopButton
            color="watercourse"
            onClick={() => {
              setHasErrored(false);
              client
                .POST("/api/v1/room/close", {
                  body: playerDetails.roomCode
                    ? { roomCode: playerDetails.roomCode }
                    : {},
                })
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
      <div className="absolute bottom-12 right-24 flex justify-center items-center">
        <h3 className="text-watercourse-950 text-center text-sm font-medium animate-pop">
          why not add a photo while you wait?
        </h3>
        <ArrowRightIcon className="w-5 h-5 text-watercourse-950 ml-2 -mr-2" />
      </div>
    </div>
  );
}
