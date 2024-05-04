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
  { playState: "setBalance", balance: 1000 },
  { playState: "complete", state: "complete" },
  {
    playState: "double-blinds-vote",
    ballotDetails: {
      action: "doubleBlinds",
      expiresDt: new Date().getTime() + 15000,
    },
    startBallotOptions: undefined
  },
  {
    playState: "kick-vote", state: "playing",

    startBallotOptions: undefined,
    ballotDetails: {
      action: {
        kickPlayer: "Player 1",
      },
      expiresDt: new Date().getTime() + 15000,
    }
  },
  {
    playState: "start-ballot",
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

  return (
    <>
      <div
        className={cn(
          "absolute top-20 left-0 w-full h-10 bg-charcoal-900 bg-opacity-50",
          "transition-all duration-300 grid grid-cols-4 gap-4 z-50"
        )}
      >
        {modes.map((mode, idx) => (
          <button
            key={idx}
            onClick={() => setPlayer({ ...player, ...mode })}
            className="text-white bg-charcoal-700 hover:bg-charcoal-600 transition-all duration-300"
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
