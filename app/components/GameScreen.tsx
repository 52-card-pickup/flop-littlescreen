import { ChangeEvent, useEffect, useState } from "react";
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

  function setStake(newStake: number) {
    if (newStake > 0 && newStake < props.state.minRaiseTo) {
      newStake = props.state.minRaiseTo;
    }
    if (Number.isNaN(newStake)) {
      newStake = 0;
    }
    setStakeImpl(newStake);
  }

  useEffect(() => {
    if (props.state.state === "complete") {
      setMode("complete");
      setShowCards(true);
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
  const betAction = calculateBetAction(
    stake,
    props.state.callAmount,
    props.state.currentRoundStake
  );

  function onStakeChange(e: ChangeEvent<HTMLInputElement>) {
    const value = parseFloat(e.target.value);
    if (value < props.state.minRaiseTo) {
      return setStake(0);
    }
    return setStake(value);
  }

  const timeLeftToPlay = props.state.yourTurn
    ? Math.ceil(timer.timeLeft).toString().split("")
    : null;

  return (
    <div
      className={cn(
        // "grid h-dvh transition-all duration-500 bg-[linear-gradient(329deg,#90cda3,#e6fff0)]",
        "grid w-dvw h-dvh transition-all duration-500",
        mode === "yourturn"
          ? "grid-rows-[1fr,5fr,1fr,1fr,0.2fr] delay-0 bg-[linear-gradient(329deg,#52745c,#9fd19f)]"
          : "grid-rows-[0fr,5fr,1fr,1fr] delay-300 bg-[linear-gradient(149deg,#52745c,#74907c)]"
      )}
    >
      <div className={cn("place-self-center")}>
        {timeLeftToPlay && (
          <div
            className={cn(
              "font-bold text-4xl bg-white/80 rounded-xl px-3 py-2 mt-4 shadow-sm shadow-black/40",
              timer.timeLeft < 10
                ? "text-red-500 animate-pulse"
                : "text-slate-900"
            )}
          >
            {timeLeftToPlay.map((c, i) => (
              <span className="inline-block w-6 text-center" key={i}>
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className={cn("grid items-center")}>
        <div className="h-[50vh]">
          <Cards
            cards={props.state.cards}
            showCards={showCards}
            showHideCardsHint={!props.state.yourTurn}
            onClick={() => setShowCards((prev) => !prev)}
          />
        </div>
      </div>
      <div
        className={cn(
          "grid text-white font-bold transition-all duration-300 w-10/12 place-self-center mb-4",
          props.state.currentRoundStake === 0
            ? "grid-cols-[1fr,0]"
            : "grid-cols-[1fr,1fr] gap-4"
        )}
      >
        <div className="place-self-center flex flex-col text-slate-50 bg-slate-200/0 py-2 w-full text-center border border-slate-100 rounded-lg">
          <span className="uppercase font-normal text-slate-100">Balance</span>
          <span>£{props.state.balance}</span>
        </div>
        <div
          className={cn(
            "place-self-center flex flex-col text-slate-50 bg-slate-200/0 py-2 w-full text-center border border-slate-100 rounded-lg",
            props.state.currentRoundStake !== 0 ? "opacity-100" : "opacity-0"
          )}
        >
          <span className="uppercase font-normal text-slate-100">Staked</span>
          <span>£{props.state.currentRoundStake}</span>
        </div>
      </div>
      {mode !== "complete" ? (
        <div
          className={cn(
            "place-self-center grid grid-rows-[auto,1fr]",
            "p-2 shadow-md shadow-slate-800/20",
            "transition-all duration-300",
            "w-10/12 rounded-xl",
            mode === "yourturn"
              ? "bg-zinc-100/40 h-full" // ? "bg-green-100 h-full" // #83d894 // rgb(131 216 148)
              : "bg-french_gray-400 opacity-0 h-0" // h-0 causes a bit of jankiness
          )}
        >
          {mode === "yourturn" && (
            <>
              <div className="place-self-center grid gap-3 px-1 w-full">
                <div className="flex items-center gap-4 p-2">
                  <input
                    type="range"
                    className={cn(
                      "slider touch-none w-full h-3 bg-french_gray-100 rounded-xl appearance-none cursor-pointer range-lg color-red accent-french_gray-900 grow",
                      "border-[16px] border-x-[8px] border-french_gray-100"
                    )}
                    min={0} // Enforce minimum value
                    max={props.state.balance} // Maximum value
                    value={stake} // Current value
                    onChange={(e) => onStakeChange(e)}
                    step={5} // Adjust stepping as necessary
                  />
                </div>
              </div>
              <div className="grid grid-cols-[2fr,5fr] w-full gap-4 p-3">
                <div className="place-self-center w-full flex flex-col">
                  <FlopButton
                    onClick={props.actions.fold}
                    color="red"
                    variant="solid"
                  >
                    Fold
                  </FlopButton>
                </div>
                <div className="place-self-center w-full flex flex-col">
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
                    variant="outline"
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
      ) : (
        <div className="grid justify-center">
          <div
            className={cn(
              "p-2",
              mode === "complete" ? "opacity-100" : "opacity-0"
            )}
          >
            <FlopButton
              onClick={() => {
                client.POST("/api/v1/room/close");
              }}
            >
              Next Round
            </FlopButton>
          </div>
        </div>
      )}
    </div>
  );
}

function calculateBetAction(
  stake: number,
  callAmount: number,
  currentRoundStake: number
) {
  if (callAmount > 0) {
    if (currentRoundStake === callAmount) {
      return "check";
    }
    return stake >= callAmount ? "bet" : "call";
  }
  return stake > 0 ? "bet" : "check";
}
