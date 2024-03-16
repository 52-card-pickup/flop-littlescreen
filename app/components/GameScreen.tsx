import { useEffect, useState } from "react";
import Cards from "~/components/Cards";
import { client } from "~/flopClient";
import { useCountdown } from "~/routes/useCountdown";
import { GamePlayerState } from "~/state";
import cn from "~/utils/cn";

const modes = ["yourturn", "waiting", "complete"] as const;

interface Props {
  state: GamePlayerState;
  actions: {
    fold: () => void;
    bet: (stake: number) => void;
    check: () => void;
    call: (amount: number) => void;
  };
}

export default function GameScreen(props: Props) {
  const [mode, setMode] = useState<(typeof modes)[number]>("waiting");
  const [stake, setStake] = useState<number>(0);

  useEffect(() => {
    if (props.state.state === "complete") {
      setMode("complete");
      return;
    }
    if (props.state.state === "offline") setMode("waiting");
    if (props.state.yourTurn) setMode("yourturn");
    if (!props.state.yourTurn) setMode("waiting");
  }, [props.state]);

  const timer = useCountdown({
    turnExpiresDt: props.state.turnExpiresDt || 0,
  });

  return (
    <div
      className={cn(
        "grid h-dvh transition-all duration-500 bg-charcoal-900",
        mode === "yourturn"
          ? "grid-rows-[1fr,5fr,1fr,1fr] delay-0"
          : "grid-rows-[2fr,5fr,2fr,0fr] delay-300"
      )}
    >
      <div className={cn("place-self-center")}>
        <div className="place-self-center">
          {props.state.yourTurn && (
            <>
              {timer.timeLeft > 0 &&
                timer.timeLeft < 10 &&
                Math.ceil(timer.timeLeft)}
            </>
          )}
        </div>
      </div>
      <div className="h-[50vh] ">
        <Cards cards={props.state.cards} showCards={true} />
      </div>
      <div
        className={cn(
          "grid text-white font-bold transition-all duration-300 w-full",
          stake === 0 ? "grid-cols-[1fr,0fr]" : "grid-cols-[1fr,1fr] gap-4"
        )}
      >
        <div className="place-self-center">£{props.state.balance}</div>
        <div
          className={cn(
            "place-self-center",
            stake !== 0 ? "opacity-100" : "opacity-0"
          )}
        >
          {props.state.currentRoundStake}
        </div>
      </div>
      <div
        className={cn(
          "place-self-center grid grid-rows-2",
          "transition-all duration-300",
          "w-10/12 rounded-md",
          mode === "yourturn"
            ? "bg-charcoal-700 h-full"
            : "bg-french_gray-400 opacity-0 h-0" // h-0 causes a bit of jankiness
        )}
      >
        <div className="grid grid-cols-2 w-full">
          <div className="place-self-center m-3">
            <button
              className={cn(
                "bg-wenge-500 hover:bg-wenge-700 text-white font-bold py-2 px-4 rounded-md",
                "transition-all duration-300",
                mode === "yourturn" ? "opacity-100 delay-300" : "opacity-0"
              )}
              onClick={() => {
                props.actions.fold();
              }}
            >
              Fold
            </button>
          </div>
          <div className="place-self-center m-3">
            <button
              className={cn(
                "bg-wenge-500 hover:bg-wenge-700 text-white font-bold py-2 px-4 rounded-md",
                "transition-all duration-300",
                mode === "yourturn"
                  ? "opacity-100 delay-300"
                  : "opacity-0 duration-300"
              )}
              onClick={() => {
                if (props.state.callAmount === 0) {
                  props.actions.check();
                }
                if (props.state.callAmount > 0) {
                  props.actions.call(props.state.callAmount);
                }
              }}
            >
              {props.state.callAmount === 0
                ? "Check"
                : `Call ($${props.state.callAmount})`}
            </button>
          </div>
        </div>
        <div className="place-self-center grid grid-cols-[2fr,1fr] w-5/6 gap-3">
          <div className="flex items-center space-x-4">
            <input
              type="range"
              className="slider bg-white color-black accent-wenge-700"
              min={props.state.minRaiseBy} // Minimum value
              max={props.state.balance} // Maximum value
              value={stake} // Current value
              onChange={(e) => setStake(parseFloat(e.target.value))}
              step="5" // Adjust stepping as necessary
            />
            <input
              type="number"
              className="w-20 p-2 border rounded-md"
              min={props.state.minRaiseBy} // Enforce minimum value
              max={props.state.balance} // Enforce maximum value
              value={stake} // Sync with slider
              onChange={(e) =>
                setStake(parseFloat(e.target.value) || props.state.minRaiseBy)
              }
              onBlur={(e) => {
                // Clamping logic on blur to handle manual input
                const value = parseFloat(e.target.value) || 0;
                const clampedValue = Math.min(
                  Math.max(value, props.state.minRaiseBy),
                  props.state.balance
                );
                setStake(clampedValue);
              }}
            />
          </div>
          <button
            className={cn(
              "bg-wenge-500 hover:bg-wenge-700 text-white font-bold py-2 px-4 rounded-md",
              "transition-all duration-300",
              mode === "yourturn"
                ? "opacity-100 delay-300"
                : "opacity-0 duration-300"
            )}
            onClick={() => {
              props.actions.bet(stake);
            }}
          >
            Bet
          </button>
        </div>
      </div>
      <div
        className={cn(
          "place-self-center p-2",
          mode === "complete" ? "opacity-100" : "opacity-0"
        )}
      >
        <button
          className={cn(
            "bg-wenge-500 hover:bg-wenge-700 text-white font-bold py-2 px-4 rounded-md",
            "transition-all duration-300",
            "opacity-100 delay-300"
          )}
          onClick={() => {
            client.POST("/api/v1/room/close");
          }}
        >
          Next Round
        </button>
      </div>
    </div>
  );
}
