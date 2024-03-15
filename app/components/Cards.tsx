import { components } from "../flopClient/spec";

export type PlayingCards = components["schemas"]["GamePlayerState"]["cards"];

export default function Cards(props: {
  cards: PlayingCards;
  showCards?: boolean;
}) {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="relative w-5/6 h-5/6 flex justify-center items-center">
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
            className={`absolute shadow-md drop-shadow-lg transform ${
              idx === 0
                ? "translate-x-10 rotate-12"
                : "-translate-x-10 -rotate-3"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function cardToSvg(card: PlayingCards[0]) {
  return `/assets/playing-cards/fronts/${card[0]}_${card[1]}.svg`;
}
