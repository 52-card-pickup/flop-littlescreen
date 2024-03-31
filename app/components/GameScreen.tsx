import { useEffect, useState } from "react";
import Cards from "~/components/Cards";
import { client } from "~/flopClient";
import { useCountdown } from "~/routes/useCountdown";
import { GamePlayerState } from "~/state";
import cn from "~/utils/cn";
import FlopButton from "./FlopButton";

const modes = ["yourturn", "waiting", "complete"] as const;

interface Props {
  state: GamePlayerState;
  actions: {
    fold: () => void;
    raiseTo: (stake: number) => void;
    check: () => void;
    call: (amount: number) => void;
  };
}

export default function GameScreen(props: Props) {
  const [mode, setMode] = useState<(typeof modes)[number]>("waiting");
  const [stake, setStakeImpl] = useState<number>(0);
  const [showCards, setShowCards] = useState(true);

  const setStake = (newStake: number) => {
    console.error("setStake", newStake);
    setStakeImpl(newStake);
  };

  useEffect(() => {
    if (props.state.state === "complete") {
      setMode("complete");
      return;
    }
    if (props.state.state === "offline") setMode("waiting");
    if (props.state.yourTurn) setMode("yourturn");
    if (!props.state.yourTurn) setMode("waiting");
  }, [props.state]);

  useEffect(() => {
    setShowCards(props.state.yourTurn);
    if (props.state.yourTurn) {
      setStake(0);
    }
  }, [props.state.yourTurn]);

  const timer = useCountdown({
    turnExpiresDt: props.state.turnExpiresDt || 0,
  });

  const stakeToCall = Math.min(
    props.state.balance,
    props.state.callAmount - props.state.currentRoundStake
  );
  const betAction = calculateBetAction(stake, props.state.callAmount);

  return (
    <div
      className={cn(
        "grid h-dvh transition-all duration-500 bg-slate-200",
        mode === "yourturn"
          ? "grid-rows-[1fr,5fr,1fr,1fr] delay-0"
          : "grid-rows-[2fr,5fr,2fr,0fr] delay-300"
      )}
    >
      <div className={cn("place-self-center")}>
        <div
          className={cn(
            "font-bold text-4xl",
            timer.timeLeft < 10
              ? "text-red-500 animate-pulse"
              : "text-slate-800"
          )}
        >
          {props.state.yourTurn && <>{Math.ceil(timer.timeLeft)}</>}
        </div>
      </div>
      <div className="h-[50vh] ">
        <Cards
          cards={props.state.cards}
          showCards={showCards}
          showHideCardsHint={!props.state.yourTurn}
          onClick={() => setShowCards((prev) => !prev)}
        />
      </div>
      <div
        className={cn(
          "grid text-white font-bold transition-all duration-300 w-10/12 place-self-center",
          props.state.currentRoundStake === 0
            ? "grid-cols-[1fr,0]"
            : "grid-cols-[1fr,1fr] gap-4"
        )}
      >
        <div className="place-self-center flex flex-col text-charcoal-500 py-2 w-full text-center border border-slate-900 rounded-md">
          <span className="uppercase font-normal text-slate-700">Balance</span>
          <span>£{props.state.balance}</span>
        </div>
        <div
          className={cn(
            "place-self-center flex flex-col text-charcoal-500 py-2 w-full text-center border border-slate-900 rounded-md",
            props.state.currentRoundStake !== 0 ? "opacity-100" : "opacity-0"
          )}
        >
          <span className="uppercase font-normal text-slate-700">Staked</span>
          <span>£{props.state.currentRoundStake}</span>
        </div>
      </div>
      <div
        className={cn(
          "place-self-center grid grid-rows-2",
          "p-2 shadow-md shadow-slate-800/20",
          "transition-all duration-300",
          "w-10/12 rounded-xl",
          mode === "yourturn"
            ? "bg-charcoal-700 h-full"
            : "bg-french_gray-400 opacity-0 h-0" // h-0 causes a bit of jankiness
        )}
      >
        {mode === "yourturn" && (
          <>
            <div className="place-self-center grid gap-3 p-2 w-full">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  className="slider bg-white color-black accent-wenge-700 grow"
                  min={0} // Minimum value
                  max={props.state.balance} // Maximum value
                  value={stake} // Current value
                  onChange={(e) => {
                    if (parseFloat(e.target.value) < props.state.minRaiseTo) {
                      return setStake(0);
                    }
                    return setStake(parseFloat(e.target.value));
                  }}
                  step="5" // Adjust stepping as necessary
                />
                <input
                  type="number"
                  className="w-20 p-2 border rounded-md"
                  min={0} // Enforce minimum value
                  max={props.state.balance} // Enforce maximum value
                  value={stake} // Sync with slider
                  onChange={(e) =>
                    setStake(
                      parseFloat(e.target.value) || props.state.minRaiseTo
                    )
                  }
                  onBlur={(e) => {
                    // Clamping logic on blur to handle manual input
                    const value = parseFloat(e.target.value) || 0;
                    const clampedValue = Math.min(
                      Math.max(value, props.state.minRaiseTo),
                      props.state.balance
                    );
                    setStake(clampedValue);
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 w-full">
              <div className="place-self-center m-3">
                <FlopButton onClick={props.actions.fold}>Fold</FlopButton>
              </div>
              <div className="place-self-center m-3">
                <FlopButton
                  onClick={() => {
                    switch (betAction) {
                      case "bet":
                        props.actions.raiseTo(stake);
                        break;
                      case "check":
                        props.actions.check();
                        break;
                      case "call":
                        props.actions.call(props.state.callAmount);
                        break;
                    }
                  }}
                >
                  {betAction === "check"
                    ? "Check"
                    : betAction === "call"
                      ? `Call (£${stakeToCall})`
                      : `Raise to £${stake}`}
                </FlopButton>
              </div>
            </div>
          </>
        )}
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

function calculateBetAction(stake: number, callAmount: number) {
  if (callAmount > 0) {
    return stake >= callAmount ? "bet" : "call";
  }
  return stake > 0 ? "bet" : "check";
}
