import { useState } from "react";
import { components } from "~/flopClient/spec";
import { XMarkIcon } from "~/icons/XMarkIcon";
import { BallotAction } from "~/routes/game";
import FlopButton from "./FlopButton";

type StartBallotOptions = components["schemas"]["StartBallotChoices"];

interface StartBallotMenuProps {
    startBallotOptions: StartBallotOptions;
    onClose: () => void;
    onStartBallot: (ballotAction: BallotAction) => void;
}

export function StartBallotMenu({
    startBallotOptions,
    onClose,
    onStartBallot,
}: StartBallotMenuProps) {
    const [menuState, setMenuState] = useState<"main-menu" | "kick-player">(
        "main-menu"
    );

    return (
        <div
            className="grid absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 \
        bg-white p-4 rounded-xl shadow-lg z-50 h-auto min-w-60"
        >
            <div className="pb-3 grid grid-cols-[1fr,auto]">
                {menuState === "main-menu" ? "Start Ballot" : "Kick Player"}
                <button onClick={onClose} className="justify-self-end">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {menuState === "main-menu" && startBallotOptions.double_blinds && (
                    <FlopButton
                        onClick={() => {
                            onStartBallot("doubleBlinds");
                            onClose();
                        }}
                    >
                        Double blinds
                    </FlopButton>
                )}
                {menuState === "main-menu" &&
                    startBallotOptions.kick_player.length > 0 && (
                        <FlopButton onClick={() => setMenuState("kick-player")}>
                            Kick player
                        </FlopButton>
                    )}
                {menuState === "kick-player" && (
                    // select menu + kick button and a back button
                    <div className="">
                        <form
                            className="grid grid-flow-row gap-3"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target as HTMLFormElement);
                                const playerId = formData.get("playerId") as string;
                                onStartBallot({ kickPlayer: playerId });
                                onClose();
                            }}
                        >
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm
                                    focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                {startBallotOptions.kick_player.map((player) => (
                                    <option key={player.id} value={player.id}>
                                        {player.name}
                                    </option>
                                ))}
                            </select>
                            <FlopButton type="submit"> Kick</FlopButton>
                        </form>
                        <FlopButton
                            className="pt-3"
                            onClick={() => setMenuState("main-menu")}
                        >
                            Back
                        </FlopButton>
                    </div>
                )}
            </div>
        </div>
    );
}
