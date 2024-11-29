import { Transition } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import FlopButton from "./FlopButton";
import { CloseButton } from "./CloseButton";

export function ResumeSessionModal({
  resume,
  setResume,
  state,
  resumeRoomSession,
  disabled,
}: {
  resume: { room: string; name: string } | null;
  setResume: React.Dispatch<
    React.SetStateAction<{ room: string; name: string } | null>
  >;
  state: "new" | "join" | "room-code-entry" | "default";
  resumeRoomSession: (roomCode: string) => void;
  disabled: boolean;
}) {
  return (
    <Transition
      show={!!resume && state === "join"}
      as={Fragment}
      enter="transition-all ease-in-out transform duration-500 delay-300"
      enterFrom="opacity-0 translate-y-16"
      enterTo="opacity-100 translate-y-0"
      leave="transition-all ease-in-out transform duration-500"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-16"
    >
      <div className="fixed flex -bottom-2 left-0 w-full justify-center z-50">
        <div className="relative grid gap-4 items-start bg-slate-100 p-12 pb-16 w-5/6 rounded-lg shadow-lg shadow-black/40 animate-fadeIn">
          <h3 className="text-lg font-semibold text-center text-slate-700 pb-6">
            {resume && <>Do you want to resume the game as '{resume.name}'?</>}
          </h3>
          <div className="grid justify-center gap-4">
            <FlopButton
              onClick={() => {
                if (!resume) return;
                resumeRoomSession(resume.room);
              }}
              color="watercourse"
              variant="solid"
              label="Resume"
              className="transition-all duration-300 ease-in-out"
              disabled={disabled}
            >
              <span className="font-semibold">Resume Session</span>
            </FlopButton>
            <FlopButton
              onClick={() => setResume(null)}
              color="watercourse"
              variant="outline"
              label="Cancel"
              className="transition-all duration-300 ease-in-out"
              disabled={disabled}
            >
              <span className="font-semibold">Create new player</span>
            </FlopButton>
          </div>
          <CloseButton onClick={() => setResume(null)} />
        </div>
      </div>
    </Transition>
  );
}
