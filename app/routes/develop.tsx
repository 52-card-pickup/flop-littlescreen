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
    turnExpiresDt: new Date().getTime() + 15000,
  },
  {
    playState: "Your turn (call)",
    yourTurn: true,
    state: "playing",
    callAmount: 100,
    minRaiseBy: 100,
  },
  { playState: "Waiting", yourTurn: false, state: "playing" },
  { playState: "setBalance", balance: 1000 },
];

export default function Develop() {
  const [player, setPlayer] = useRecoilState(playerState);

  return (
    <>
      <div
        className={cn(
          "absolute top-20 left-0 w-full h-10 bg-charcoal-900 bg-opacity-50",
          "transition-all duration-300 grid grid-cols-4 gap-4"
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
          bet: () => {},
          call: () => {},
          check: () => {},
          fold: () => {},
        }}
      />
    </>
  );
}
