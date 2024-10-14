import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { components } from "~/flopClient/spec";
import { useDocument } from "~/hooks/useDocument";

type CardValue = components["schemas"]["CardValue"];
type CardSuite = components["schemas"]["CardSuite"];

export const RulesHelpButton = React.forwardRef<
  HTMLDivElement,
  {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  } & React.ComponentPropsWithoutRef<"div">
>(({ open: propsOpen, onOpenChange, ...props }, ref) => {
  const [open, setOpen] = useState(propsOpen ?? false);
  useEffect(() => {
    setOpen(propsOpen ?? false);
  }, [propsOpen]);
  function handleOpen() {
    onOpenChange ? onOpenChange(true) : setOpen(true);
  }
  function handleClose() {
    onOpenChange ? onOpenChange(false) : setOpen(false);
  }
  return (
    <div {...props} ref={ref}>
      <button
        className="flex justify-center items-center h-full w-full max-w-[48px] max-h-[48px]"
        aria-label="Game Rules"
        onClick={handleOpen}
      >
        <svg
          fill="none"
          strokeWidth={2}
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
          />
        </svg>
      </button>
      {open && <RuleHelpModal onClose={handleClose} />}
    </div>
  );
});

function RuleHelpModal({ onClose }: { onClose: () => void }) {
  const document = useDocument();

  const [handStrengthsVisible, setHandStrengthsVisible] = useState(false);

  if (!document) return null;

  return createPortal(
    <div className="fixed grid top-8 left-8 bottom-8 right-8 bg-[#b0dbbf] rounded-lg p-4 grid-rows-[auto,1fr,auto] gap-4 shadow-lg shadow-slate-800/20 z-50">
      {handStrengthsVisible ? (
        <>
          <h2 className="text-slate-900 font-bold text-xl mt-4 text-center">
            Hand Strengths
          </h2>
          <div className="overflow-auto max-h-full">
            <p className="text-black text-start">
              The strength of a poker hand is determined by the best combination
              of 5 cards from a maximum of 7 cards (2 cards in your hand and 5
              on the table). The following list shows the ranking of poker hands
              from highest to lowest:
            </p>
            <ul className="text-black text-center">
              <li>
                1. Royal Flush
                <HandPreview
                  cards={[
                    ["ace", "hearts"],
                    ["king", "hearts"],
                    ["queen", "hearts"],
                    ["jack", "hearts"],
                    ["10", "hearts"],
                  ]}
                />
              </li>
              <li>
                2. Straight Flush
                <HandPreview
                  cards={[
                    ["9", "diamonds"],
                    ["8", "diamonds"],
                    ["7", "diamonds"],
                    ["6", "diamonds"],
                    ["5", "diamonds"],
                  ]}
                />
              </li>
              <li>
                3. Four of a Kind
                <HandPreview
                  cards={[
                    ["ace", "hearts"],
                    ["ace", "clubs"],
                    ["ace", "diamonds"],
                    ["ace", "spades"],
                    ["10", "hearts"],
                  ]}
                />
              </li>
              <li>
                4. Full House
                <HandPreview
                  cards={[
                    ["ace", "diamonds"],
                    ["ace", "hearts"],
                    ["ace", "clubs"],
                    ["10", "hearts"],
                    ["10", "diamonds"],
                  ]}
                />
              </li>
              <li>
                5. Flush
                <HandPreview
                  cards={[
                    ["ace", "hearts"],
                    ["king", "hearts"],
                    ["queen", "hearts"],
                    ["jack", "hearts"],
                    ["9", "hearts"],
                  ]}
                />
              </li>
              <li>
                6. Straight
                <HandPreview
                  cards={[
                    ["9", "diamonds"],
                    ["8", "clubs"],
                    ["7", "diamonds"],
                    ["6", "clubs"],
                    ["5", "diamonds"],
                  ]}
                />
              </li>
              <li>
                7. Three of a Kind
                <HandPreview
                  cards={[
                    ["ace", "hearts"],
                    ["ace", "diamonds"],
                    ["ace", "clubs"],
                    ["10", "hearts"],
                    ["9", "diamonds"],
                  ]}
                />
              </li>
              <li>
                8. Two Pair
                <HandPreview
                  cards={[
                    ["ace", "diamonds"],
                    ["ace", "hearts"],
                    ["10", "clubs"],
                    ["10", "hearts"],
                    ["9", "diamonds"],
                  ]}
                />
              </li>
              <li>
                9. One Pair
                <HandPreview
                  cards={[
                    ["ace", "hearts"],
                    ["ace", "diamonds"],
                    ["10", "clubs"],
                    ["9", "hearts"],
                    ["8", "diamonds"],
                  ]}
                />
              </li>
              <li>
                10. High Card
                <HandPreview
                  cards={[
                    ["ace", "hearts"],
                    ["king", "diamonds"],
                    ["9", "clubs"],
                    ["5", "spades"],
                    ["2", "diamonds"],
                  ]}
                />
              </li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-black font-bold text-2xl p-2 text-center">
            flop.
          </h2>
          <div className="grid content-start px-2 gap-6">
            <p className="text-black">
              <b>flop</b> is a poker game of skill and strategy. The goal is to
              win as large of a pot as possible by betting on the strength of
              your hand.
            </p>
            <p className="text-black">
              The game is played in rounds, with each round consisting of a
              series of betting actions. The player with the best hand at the
              end of the round wins the pot.
            </p>
            <p className="text-black">
              To start a round, click the &quot;Start Game&quot; button. You
              will be dealt two cards, and the flop (three community cards) will
              be revealed. You can then choose to fold, check, raise, or call.
            </p>
            <p className="text-black">
              The game ends when all players have folded, or when the final
              round of betting is complete. The player with the best hand wins
              the pot.
            </p>
          </div>
        </>
      )}
      <div className="grid justify-center gap-4 self-end">
        <button
          className="px-4 py-3 my-2 bg-green-300 text-black font-bold rounded-lg shadow-md shadow-black/20 transition duration-150 ease-in-out hover:bg-white hover:shadow-xl"
          onClick={() => {
            setHandStrengthsVisible((prev) => !prev);
          }}
        >
          {handStrengthsVisible ? "Hide" : "See"} Hand Strengths
        </button>
      </div>
      <button className="absolute top-2 left-2 w-8 h-8 m-2" onClick={onClose}>
        <svg
          fill="none"
          strokeWidth={1.5}
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
    </div>,
    document.body
  );
}

function HandPreview({ cards }: { cards: [CardValue, CardSuite][] }) {
  return (
    <div className="grid grid-cols-5 p-2 mb-3">
      {cards.map(([value, suite], i) => (
        <span key={i} className="px-1">
          <Card key={i} value={value} suite={suite} />
        </span>
      ))}
    </div>
  );
}

function Card({ suite, value }: { suite: CardSuite; value: CardValue }) {
  return (
    <span
      role="img"
      aria-label="card"
      className="bg-white px-1 py-2 rounded-sm text-2xl w-fit justify-self-center font-medium"
    >
      <ValueCharacter value={value} />
      <SuitEmoji suit={suite} />
    </span>
  );
}

function SuitEmoji({ suit }: { suit: string }) {
  switch (suit) {
    case "hearts":
      return (
        <span role="img" aria-label="hearts" className="text-[#ff0000]">
          ♥️
        </span>
      );
    case "diamonds":
      return (
        <span role="img" aria-label="diamonds" className="text-[#ff0000]">
          ♦️
        </span>
      );
    case "clubs":
      return (
        <span role="img" aria-label="clubs" className="text-black">
          ♣️
        </span>
      );
    case "spades":
      return (
        <span role="img" aria-label="spades" className="text-black">
          ♠️
        </span>
      );
    default:
      return null;
  }
}

function ValueCharacter({ value }: { value: CardValue }) {
  switch (value) {
    case "ace":
      return "A";
    case "king":
      return "K";
    case "queen":
      return "Q";
    case "jack":
      return "J";
    default:
      return value;
  }
}
