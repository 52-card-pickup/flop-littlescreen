import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import GameScreen from "~/components/GameScreen";
import { client } from "~/flopClient";
import usePlayerDetails from "~/hooks/usePlayerDetails";
import { usePlayerPolling } from "~/hooks/usePlayerPolling";
import { playerState } from "~/state";

export default function Game() {
  usePlayerPolling();

  const [player] = useRecoilState(playerState);
  const { playerDetails, loading } = usePlayerDetails();

  const navigate = useNavigate();

  useEffect(() => {
    if (
      !loading &&
      (!playerDetails || !playerDetails.id || playerDetails.id === "")
    ) {
      navigate("/");
    }
  }, [loading, playerDetails, navigate]);

  if (player.state === "waiting" || player.state === "offline") {
    return (
      <div
        className="min-h-screen grid grid-flow-row grid-rows-[1fr,1fr,1fr,1fr] 
      text-white place-self-center bg-slate-200"
      >
        <div className="flex justify-center items-center h-screen">
          <button
            onClick={() => {
              client.POST("/api/v1/room/close");
            }}
            className="bg-french_gray-300 text-white hover:bg-cerulean-500 transition-all duration-300 p-2 rounded-md"
          >
            Start Game
          </button>
        </div>
      </div >
    );
  }

  return (
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
        bet: (stake: number) => {
          client.POST("/api/v1/play", {
            body: {
              action: "raise",
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
  );
}
