import { useState } from "react";
import { useRecoilState } from "recoil";
import GameScreen from "~/components/GameScreen";
import { GamePlayerState, playerState } from "~/state";
import cn from "~/utils/cn";

const modes: (Partial<GamePlayerState> & { playState: string })[] = [
  {
    playState: "Your turn (check)",
    yourTurn: true,
    state: "playing",
    callAmount: 0,
    minRaiseTo: 20,
    turnExpiresDt: new Date().getTime() + 15000,
    balance: 1000
  },
  {
    playState: "Your turn (call)",
    yourTurn: true,
    state: "playing",
    callAmount: 100,
    minRaiseTo: 200,
    balance: 1000
  },
  { playState: "Waiting", yourTurn: false, state: "playing" },
  { playState: "Set balance to 1000", balance: 1000 },
  { playState: "Completed round", state: "complete" },
  {
    playState: "Vote for double blinds",
    ballotDetails: {
      action: "doubleBlinds",
      expiresDt: new Date().getTime() + 15000,
    },
    startBallotOptions: undefined
  },
  {
    playState: "Vote to kick player", state: "playing",

    startBallotOptions: undefined,
    ballotDetails: {
      action: {
        kickPlayer: "Player 1",
      },
      expiresDt: new Date().getTime() + 15000,
    }
  },
  {
    playState: "Start a ballot",
    ballotDetails: undefined,
    startBallotOptions: {
      double_blinds: true,
      kick_player: [
        {
          id: "Player 1",
          name: "Player 1",
        },
        {
          id: "Player 2",
          name: "Player 2",
        },
        {
          id: "Player 3",
          name: "Player 3",
        },
      ]
    }
  }

];

export default function Develop() {
  const [player, setPlayer] = useRecoilState(playerState);
  const [hidden, setHidden] = useState(true);


  return (
    <>
      <button
        onClick={() => setHidden(!hidden)}
        className="absolute z-50 top-0 rounded-r-md p-1 left-0 bg-charcoal-900 bg-opacity-50 "
      >
        {hidden ? "Show" : "Hide"} dev
      </button>

      <div
        className={cn(
          "absolute top-20 left-0 h-10 bg-charcoal-900 bg-opacity-50",
          "transition-all duration-300 grid gap-4 z-50 w-1/6 bg-opacity-0 hover:bg-opacity-100",
          hidden ? "hidden" : "",
        )}
      >
        {modes.map((mode, idx) => (
          <button
            key={idx}
            onClick={() => {
              setHidden(true);
              return setPlayer({ ...player, ...mode });
            }}
            className="text-white bg-charcoal-500 p-1 rounded-md hover:bg-charcoal-600 transition-all duration-300"
          >
            {mode.playState}
          </button>
        ))}
      </div>

      <GameScreen
        state={player}
        actions={{
          fold: () => { console.log("fold"); return Promise.resolve() },
          call: () => { console.log("call"); return Promise.resolve() },
          raiseTo: () => { console.log("raise"); return Promise.resolve() },
          check: () => { console.log("check"); return Promise.resolve() },
          castVote: () => { console.log("vote"); return Promise.resolve() },
          startVote: () => { console.log("start vote"); return Promise.resolve() },
        }}
      />
    </>
  );
}
