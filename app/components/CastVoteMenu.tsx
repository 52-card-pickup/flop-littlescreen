import FlopButton from "./FlopButton";
import { BallotAction } from "~/routes/game";
import { XMarkIcon } from "../icons/XMarkIcon";


interface VoteMenuProps {
    onClose: () => void;
    castVote: (vote: boolean) => void;
    ballotAction: BallotAction;
}

export function CastVoteMenu({
    onClose,
    castVote,
    ballotAction
}: VoteMenuProps) {
    return (
        <div
            className="grid absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 \
        bg-white p-4 rounded-xl shadow-lg z-50 h-auto min-w-60"
        >
            <div className="grid gap-3">
                <div className="grid grid-cols-[1fr,auto]">
                    Vote to {ballotAction === "doubleBlinds" ? "double blinds" : `kick ${ballotAction.kickPlayer}`}
                    <button onClick={onClose} className="justify-self-end">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    <FlopButton
                        onClick={() => {
                            castVote(true);
                            onClose();
                        }}
                    >
                        Kick &apos;em
                    </FlopButton>
                    <FlopButton
                        onClick={() => {
                            castVote(false);
                            onClose();
                        }}
                    >
                        Nah
                    </FlopButton>
                </div>
            </div>
        </div>
    );
}


