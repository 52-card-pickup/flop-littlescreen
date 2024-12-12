import cn from "~/utils/cn";
import FlopBrandLogoText from "./FlopBrandLogoText";
import { ShareButton } from "./ShareButton";
import { DebugOverlay } from "./DebugOverlay";

export default function FlopLandingLayout(props: {
  animate?: boolean;
  children: [React.ReactNode, React.ReactNode];
}) {
  const animate = props.animate ?? true;
  return (
    <div
      className="w-screen h-dvh grid grid-flow-row grid-rows-[auto,5fr,auto] overflow-hidden"
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}
    >
      {props.children[0]}
      <div
        className={cn(
          "flex flex-col justify-center items-center",
          animate ? "animate-scaleIn" : ""
        )}
      >
        <>
          <FlopBrandLogoText
            className={cn(
              "w-40 h-40 mb-0 sm:mb-4 lg:mb-8",
              animate ? "animate-scaleIn" : ""
            )}
            aria-label="flop."
          />
        </>
        <h2
          className={cn(
            "text-2xl font-medium px-4 my-1 text-center text-watercourse-900/80",
            animate ? "animate-fadeIn" : ""
          )}
        >
          no chips, no cards, no table?
        </h2>
        <h2
          className={cn(
            "text-2xl font-medium px-4 my-1 text-center text-watercourse-900/80",
            animate ? "animate-fadeIn" : ""
          )}
        >
          no problem.
        </h2>
      </div>
      <ShareButton
        className="fixed top-4 right-4 w-8 h-8 sm:top-8 sm:right-8"
        title="Flop Poker"
        text="Play Flop Poker with your friends"
        url="https://flop.poker"
      />
      {props.children[1]}
      <DebugOverlay />
    </div>
  );
}
