/* eslint-disable jsx-a11y/click-events-have-key-events */
import cn from "~/utils/cn";
import { components } from "../flopClient/spec";

export type PlayingCards = components["schemas"]["GamePlayerState"]["cards"];

export default function Cards(props: {
  cards: PlayingCards;
  showCards?: boolean;
  showHideCardsHint?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className="flex justify-center items-center h-full w-full"
      onClick={props.onClick}
      role="button"
      tabIndex={0}
    >
      <div className="relative w-full h-full flex justify-center items-center">
        {/* This div serves as a centered container for the absolutely positioned cards */}
        {props.cards.map((card, idx) => (
          <img
            key={`${card[0]}-${card[1]}`}
            src={
              props.showCards
                ? `${cardToSvg(card)}`
                : "/assets/playing-cards/backs/blue2.svg"
            }
            alt={`${card[0]}-${card[1]}`}
            style={{ zIndex: 10 - idx, width: "auto", height: "80%" }}
            className={cn(
              "absolute shadow-md drop-shadow-lg transform",
              "transition-transform duration-500 ease-out",
              idx === (props.showCards ? 0 : 1)
                ? "translate-x-8 -translate-y-1 rotate-[10deg]"
                : "-translate-x-8 translate-y-2 rotate-[-6deg]"
            )}
          />
        ))}
        {!props.showCards && (
          <div
            className="absolute flex justify-center items-center w-full h-full"
            style={{ zIndex: 100 }}
          >
            <div className="text-black text-2xl font-bold bg-white/90 p-2 rounded-lg border-2 border-white shadow-lg shadow-slate-800/60">
              Tap to reveal cards
            </div>
          </div>
        )}
        {props.showHideCardsHint && props.showCards && (
          <div
            className="absolute flex justify-center items-center w-full h-full mt-32"
            style={{ zIndex: 100 }}
          >
            <div className="text-black text-2xl font-bold bg-white/90 p-2 rounded-lg border-2 border-white shadow-lg shadow-slate-800/30">
              Tap to hide cards
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function cardToSvg(card: PlayingCards[0]) {
  return `/assets/playing-cards/fronts/${card[0]}_${card[1]}.svg`;
}
