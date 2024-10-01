import { ChangeEvent, useEffect, useState } from "react";
import Cards from "~/components/Cards";
import { client } from "~/flopClient";
import { useCountdown } from "~/hooks/useCountdown";
import { GamePlayerState } from "~/state";
import cn from "~/utils/cn";
import FlopButton from "./FlopButton";
import { RulesHelpButton } from "./RulesHelpButton";
import { useVibrate } from "../hooks/useVibrate";
import { useRoomCode } from "~/hooks/usePlayerDetails";

const modes = ["yourturn", "waiting", "complete"] as const;

export interface GameScreenProps {
  state: GamePlayerState;
  actions: {
    fold: () => Promise<void>;
    raiseTo: (stake: number) => Promise<void>;
    check: () => Promise<void>;
    call: (amount: number) => Promise<void>;
  };
}

export default function GameScreen(props: GameScreenProps) {
  const [mode, setMode] = useState<(typeof modes)[number]>("waiting");
  const [stake, setStakeImpl] = useState<number>(0);
  const [showCards, setShowCards] = useState(true);
  const [showRules, setShowRules] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasCompletedGame, setHasCompletedGame] = useState(false);
  const vibrate = useVibrate([20, 20, 40, 20, 60]);
  const roomCode = useRoomCode();

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
      setHasCompletedGame(true);
      return;
    }
    if (props.state.state === "offline") {
      setMode("waiting");
      return;
    }
    if (hasCompletedGame && props.state.state === "playing") {
      setShowCards(false);
    }
    if (props.state.yourTurn) {
      setShowRules(false);
      setMode("yourturn");
      return;
    }
    setMode("waiting");
  }, [props.state.state, props.state.yourTurn]);

  useEffect(() => {
    if (props.state.yourTurn) {
      vibrate();
      setStake(0);
      return;
    }

    setShowCards(false);
  }, [props.state.yourTurn, vibrate]);

  const timer = useCountdown({
    turnExpiresDt: (props.state.turnExpiresDt as number | undefined) || 0,
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
        "fixed grid w-dvw h-dvh transition-all duration-500",
        mode === "complete"
          ? "grid-rows-[0fr,5fr,1fr,1fr] delay-300 bg-[linear-gradient(239deg,#52745c,#74907c)]"
          : mode === "yourturn"
          ? "grid-rows-[1fr,5fr,1fr,1fr,0.2fr] delay-0 bg-[linear-gradient(329deg,#52745c,#9fd19f)]"
          : "grid-rows-[0fr,5fr,1fr] delay-300 bg-[linear-gradient(149deg,#52745c,#74907c)]"
      )}
    >
      <RulesHelpButton
        className="fixed top-8 right-8 w-8 h-8 z-50"
        open={showRules}
        onOpenChange={setShowRules}
      />
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
                    onClick={() => handleFoldClick()}
                    color="red"
                    variant="solid"
                    disabled={loading}
                  >
                    Fold
                  </FlopButton>
                </div>
                <div className="place-self-center w-full flex flex-col">
                  <FlopButton
                    onClick={() => handleBetActionClick()}
                    variant="outline"
                    disabled={loading}
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
                client.POST("/api/v1/room/close", {
                  body: {
                    roomCode: roomCode,
                  },
                });
              }}
            >
              Next Round
            </FlopButton>
          </div>
        </div>
      )}
    </div>
  );

  function handleBetActionClick() {
    setLoading(true);
    switch (betAction) {
      case "bet":
        props.actions.raiseTo(stake).finally(() => {
          setLoading(false);
        });
        break;
      case "check":
        props.actions.check().finally(() => {
          setLoading(false);
        });
        break;
      case "call":
        props.actions.call(props.state.callAmount).finally(() => {
          setLoading(false);
        });
        break;
    }
  }

  function handleFoldClick() {
    setLoading(true);
    props.actions.fold().finally(() => {
      setLoading(false);
    });
  }
}

function calculateBetAction(
  stake: number,
  callAmount: number,
  currentRoundStake: number
) {
  if (callAmount > 0) {
    // The current stake can only match the call amount as the big blind
    const checkOrCall = currentRoundStake === callAmount ? "check" : "call";
    return stake >= callAmount ? "bet" : checkOrCall;
  }
  return stake > 0 ? "bet" : "check";
}
