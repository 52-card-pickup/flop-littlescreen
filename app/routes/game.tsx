import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { client } from "~/flopClient";
import type { components } from "~/flopClient/spec";
import { usePlayerPolling } from "~/hooks/usePlayerPolling";
import { playerDetailsState, playerState } from "~/state";
import { useCountdown } from "./useCountdown";
type Card = [
  components["schemas"]["CardSuite"],
  components["schemas"]["CardValue"]
];
export default function Game() {
  const [showCards, setShowCards] = useState<boolean>(true);
  usePlayerPolling();

  const [player] = useRecoilState(playerState);
  const [playerDetails] = useRecoilState(playerDetailsState);
  const [stakePlaceholder, setSteakPlaceholder] = useState<number>(0);

  const timer = useCountdown({
    onEnd: () => {},
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!playerDetails.id || playerDetails.id === "") {
      navigate("/");
    }
  }, [playerDetails, navigate]);

  if (player.state === "waiting") {
    return (
      <div
        className="bg-charcoal-500 min-h-screen grid grid-flow-row grid-rows-[1fr,2fr,1fr] 
      text-white place-self-center"
      >
        {/* Start game button */}
        <button
          onClick={() => {
            client.POST("/api/v1/room/close");
          }}
        >
          Start game
        </button>
      </div>
    );
  }

  return (
    <div className="bg-charcoal-500 min-h-screen grid grid-flow-row grid-rows-[1fr,2fr,2fr] text-white">
      <div className="place-self-center">
        {player.yourTurn && <>{Math.round(timer.timeLeft)}</>}
      </div>
      <div className="grid grid-flow-col gap-1 grid-cols-[1fr,4fr,1fr]">
        <div></div>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div className="" onClick={() => setShowCards(!showCards)}>
          {player.cards.map((card, idx) => (
            <img
              style={{ zIndex: 10 - idx, width: "auto", height: "30%" }}
              className={
                "h-1/4 absolute right-[18%] shadow-md drop-shadow-lg" +
                (idx === 0
                  ? " transform rotate-12"
                  : " -translate-x-1/3 transform -rotate-3")
              }
              key={`${card[0]}-${card[1]}`}
              src={
                showCards
                  ? `${cardToSvg(card)}`
                  : "/assets/playing-cards/backs/blue2.svg"
              }
              alt={`${card[0]}-${card[1]}`}
            />
          ))}
        </div>
        <div></div>
      </div>
      <div className="grid grid-rows-3 pt-5 bg-cerulean-400">
        <div className="grid grid-cols-2">
          <div className="place-self-center">Balance: £{player.balance}</div>
        </div>
        <div className="grid grid-cols-3">
          <div className="place-self-center">
            <input
              className="px-5 w-[70px] text-black"
              disabled={!player.yourTurn}
              onChange={(e) => {
                setSteakPlaceholder(parseInt(e.target.value, 10));
              }}
            ></input>
          </div>
          <button
            disabled={!player.yourTurn}
            onClick={() => {
              client.POST("/api/v1/play", {
                body: {
                  action: "raise",
                  stake: stakePlaceholder,
                  playerId: playerDetails.id,
                },
              });
            }}
            className="p-2 px-4 rounded-xl"
          >
            Bet
          </button>
          <div className="place-self-center">
            <button
              className="p-2 px-4 rounded-xl"
              disabled={!player.yourTurn}
              onClick={() => {
                client.POST("/api/v1/play", {
                  body: {
                    action: "call",
                    playerId: playerDetails.id,
                    stake: 0, // placeholder
                  },
                });
              }}
            >
              Call
            </button>
          </div>
          <div className="place-self-center">
            <button
              className="p-2 px-4 rounded-xl"
              disabled={!player.yourTurn}
              onClick={() => {
                client.POST("/api/v1/play", {
                  body: {
                    action: "fold",
                    playerId: playerDetails.id,
                    stake: 0, // placeholder
                  },
                });
              }}
            >
              Fold
            </button>
          </div>
          {/* Check */}
          <div className="place-self-center">
            <button
              className="p-2 px-4 rounded-xl"
              disabled={!player.yourTurn}
              onClick={() => {
                client.POST("/api/v1/play", {
                  body: {
                    action: "check",
                    playerId: playerDetails.id,
                    stake: 0, // placeholder
                  },
                });
              }}
            >
              Check
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function cardToSvg(card: Card) {
  return `/assets/playing-cards/fronts/${card[0]}_${card[1]}.svg`;
}
