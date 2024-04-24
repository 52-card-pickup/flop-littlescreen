import { useNavigate } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import GameScreen from "~/components/GameScreen";
import { client } from "~/flopClient";
import { useGoogleCastContext } from "~/hooks/cast_sender/useGoogleCastContext";
import usePlayerDetails from "~/hooks/usePlayerDetails";
import { usePlayerPolling } from "~/hooks/usePlayerPolling";
import { playerState } from "~/state";
import { GoogleCastButton } from "../components/GoogleCastButton";
import { WaitingRoom } from "../components/WaitingRoom";

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
    return <WaitingRoom />;
  }

  return (
    <div className="w-screen h-screen overflow-hidden">
      <GameScreen
        state={player}
        actions={{
          fold: () => {
            return client
              .POST("/api/v1/play", {
                body: {
                  action: "fold",
                  playerId: playerDetails.id,
                  stake: 0, // placeholder
                },
              })
              .then(() => {
                const promise = new Promise<void>((resolve) => {
                  resolvers.current.push(resolve);
                });
                return promise;
              })
              .catch((e) => {
                console.error(e);
                return Promise.resolve();
              });
          },
          raiseTo: (stake: number) => {
            return client
              .POST("/api/v1/play", {
                body: {
                  action: "raiseTo",
                  stake: stake,
                  playerId: playerDetails.id,
                },
              })
              .then(() => {
                const promise = new Promise<void>((resolve) => {
                  resolvers.current.push(resolve);
                });
                return promise;
              })
              .catch((e) => {
                console.error(e);
                return Promise.resolve();
              });
          },
          check: () => {
            return client
              .POST("/api/v1/play", {
                body: {
                  action: "check",
                  playerId: playerDetails.id,
                  stake: 0, // placeholder
                },
              })
              .then(() => {
                const promise = new Promise<void>((resolve) => {
                  resolvers.current.push(resolve);
                });
                return promise;
              })
              .catch((e) => {
                console.error(e);
                return Promise.resolve();
              });
          },
          call: () => {
            return client
              .POST("/api/v1/play", {
                body: {
                  action: "call",
                  playerId: playerDetails.id,
                  stake: 0, // placeholder
                },
              })
              .then(() => {
                const promise = new Promise<void>((resolve) => {
                  resolvers.current.push(resolve);
                });
                return promise;
              })
              .catch((e) => {
                console.error(e);
                return Promise.resolve();
              });
          },
        }}
      />
      <GoogleCastButton className="fixed top-8 right-8 w-8 h-8" />
    </div>
  );
}
