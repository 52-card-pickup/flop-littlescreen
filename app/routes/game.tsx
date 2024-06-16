import { useNavigate } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import GameScreen, { GameScreenProps } from "~/components/GameScreen";
import { client } from "~/flopClient";
import { components } from "~/flopClient/spec";
import { useGoogleCastContext } from "~/hooks/cast_sender/useGoogleCastContext";
import usePlayerDetails from "~/hooks/usePlayerDetails";
import { usePlayerPolling } from "~/hooks/usePlayerPolling";
import { playerState } from "~/state";
import { GoogleCastButton } from "../components/GoogleCastButton";
import { WaitingRoom } from "../components/WaitingRoom";
import { PlayerPhotoCamera } from "~/components/PlayerPhotoCamera";
import PlayerSendButton from "~/components/PlayerSendButton";

export type BallotAction = components["schemas"]["BallotAction"]

export default function Game() {
  usePlayerPolling();
  useGoogleCastContext();

  const [player] = useRecoilState(playerState);
  const { playerDetails, loading } = usePlayerDetails();
  const resolvers = useRef<(() => void)[]>([]);

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
    if (player.lastUpdate === null) return;
    if (resolvers.current.length === 0) return;
    resolvers.current.forEach((resolve) => {
      resolve();
    });
    resolvers.current = [];
  }, [player.lastUpdate]);

  if (showStartGameButton) {
    return (
      <div
        className="fixed w-screen h-screen grid grid-flow-row grid-rows-[1fr,1fr,1fr,1fr] 
text-white place-self-center bg-slate-200"
      >
        <GoogleCastButton className="fixed top-8 right-8 w-8 h-8" />
        <WaitingRoom />
        <div className="fixed left-0 bottom-8 w-full grid justify-center items-center">
          <PlayerPhotoCamera className="m-8" />
        </div>

        <div className="fixed right-8 bottom-12 w-8 h-8 grid justify-center items-center z-50">
          <PlayerSendButton />
        </div>
      </div>
    );
  }

  const actions: GameScreenProps["actions"] = {
    fold: async () => {
      try {
        await client
          .POST("/api/v1/play", {
            body: {
              action: "fold",
              playerId: playerDetails.id,
              stake: 0, // placeholder
            },
          })
          .then(createResolver(() => player.lastUpdate, resolvers));
      } catch (e) {
        console.error(e);
      }
    },
    raiseTo: async (stake: number) => {
      try {
        await client
          .POST("/api/v1/play", {
            body: {
              action: "raiseTo",
              stake: stake,
              playerId: playerDetails.id,
            },
          })
          .then(createResolver(() => player.lastUpdate, resolvers));
      } catch (e) {
        console.error(e);
      }
    },
    check: async () => {
      try {
        await client
          .POST("/api/v1/play", {
            body: {
              action: "check",
              playerId: playerDetails.id,
              stake: 0, // placeholder
            },
          })
          .then(createResolver(() => player.lastUpdate, resolvers));
      } catch (e) {
        console.error(e);
      }
    },
    call: async () => {
      try {
        await client
          .POST("/api/v1/play", {
            body: {
              action: "call",
              playerId: playerDetails.id,
              stake: 0, // placeholder
            },
          })
          .then(createResolver(() => player.lastUpdate, resolvers));
      } catch (e) {
        console.error(e);
      }
    },
    castVote: (vote: boolean) => {
      client.POST("/api/v1/ballot/cast", {
        body: {
          vote,
          playerId: playerDetails.id,
        },
      })
        .catch((e) => {
          console.error(e);
        });
    },
    startVote: (action: BallotAction) => {
      client.POST("/api/v1/ballot/start", {
        body: {
          action,
        }
      }).catch((e) => {
        console.error(e);
      });
    }
  };
  return (
    <div className="w-screen h-screen overflow-hidden">
      <GameScreen state={player} actions={actions} />
      <GoogleCastButton className="fixed top-8 right-8 w-8 h-8" />

      <div className="fixed right-8 bottom-1/3 w-8 h-8 grid justify-center items-center z-50">
        <PlayerSendButton />
      </div>
    </div >
  );
}

function createResolver(
  lastUpdate: () => number,
  resolvers: React.MutableRefObject<(() => void)[]>
) {
  const prevUpdateAt = lastUpdate();

  return async () => {
    const updateAt = lastUpdate();
    if (updateAt !== prevUpdateAt) {
      console.log("update received before action completed");
      return;
    }

    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        console.log("no update received after action completed, timeout");
        resolve();
        const idx = resolvers.current.indexOf(resolver);
        if (idx !== -1) {
          resolvers.current.splice(idx, 1);
        }
      }, 5000);

      function resolver() {
        clearTimeout(timeout);
        resolve();
      }

      resolvers.current.push(resolver);
    });
  };
}
