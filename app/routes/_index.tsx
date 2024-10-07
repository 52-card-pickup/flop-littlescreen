/* eslint-disable jsx-a11y/no-access-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import usePlayerDetails from "~/hooks/usePlayerDetails";
import { devState } from "~/state";
import { client } from "../flopClient";
import FlopButton from "~/components/FlopButton";
import { useShare } from "~/hooks/useShare";
import cn from "~/utils/cn";
import { useSearchParams } from "@remix-run/react";
import { useVibrate } from "~/hooks/useVibrate";
import FlopLandingLayout from "~/components/FlopLandingLayout";
import { RoomCodeInput } from "~/components/RoomCodeInput";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useTimeoutState } from "~/hooks/useTimeoutState";
import { Transition } from "@headlessui/react";
import { useToast } from "~/contexts/toaster";
import { HeadersFunction } from "@remix-run/node";

function useDocument() {
  const [document, setDocument] = React.useState<Document | null>(null);
  useEffect(() => {
    setDocument(window.document);
  }, []);
  return document;
}

export default function Index() {
  const setDev = useSetRecoilState(devState);
  const { playerDetails, setPlayerDetails } = usePlayerDetails();

  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = React.useState<
    "default" | "room-code-entry" | "join" | "new"
  >(searchParams.has("room") ? "join" : "default");

  const [name, setName] = React.useState<string>("");
  const [roomCode, setRoomCode] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [hasJoinError, setHasJoinError] = React.useState(false);
  const [hasJoinCodeError, setHasJoinCodeError] = useTimeoutState(false, 500);
  const [isRoomEntryAnimating, setIsRoomEntryAnimating] = useTimeoutState(
    false,
    1000
  );
  const [resume, setResume] = React.useState<{
    room: string;
    name: string;
  } | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const toast = useToast();
  const submitVibrate = useVibrate([5], 5);
  const document = useDocument();
  const share = useShare();

  function join() {
    if (name === "dev") {
      setDev({ showSwitchboard: true });
      setPlayerDetails({
        name: "dev",
        id: "dev",
      });
      navigate(`/game`);
      return;
    }
    setLoading(true);
    client
      .POST("/api/v1/join", { body: { name, roomCode } })
      .then((res) => {
        console.warn(res);

        if (res.response.status === 404) {
          setRoomCode(null);
          setState("room-code-entry");
          setLoading(false);
          return;
        }

        if (res.error) {
          return Promise.reject();
        }

        setPlayerDetails({
          name,
          id: res.data.id,
          roomCode: res.data.roomCode,
        });
        setTimeout(() => navigate(`/game`), 250);
      })
      .catch(() => {
        inputRef.current?.focus();
        setLoading(false);
        setState("join");
      });
  }

  function newRoom() {
    setLoading(true);
    client
      .POST("/api/v1/new", { body: { name } })
      .then((res) => {
        if (res.error) {
          return Promise.reject();
        }

        setPlayerDetails({
          name,
          id: res.data.id,
          roomCode: res.data.roomCode,
        });
        setTimeout(() => navigate(`/game`), 250);
      })
      .catch(() => {
        setHasJoinError(true);
        setLoading(false);
        setState("join");
      });
  }

  async function checkRoomCode(code: string) {
    code = code.toUpperCase();
    const validShape = /^[A-Z]{4}$/.test(code);
    if (!validShape) {
      return { valid: false } as const;
    }

    setLoading(true);
    return await client
      .POST("/api/v1/room/peek", { body: { roomCode: code } })
      .then((res) => {
        if (res.error) {
          return { valid: false } as const;
        }
        return { valid: true, room: res.data } as const;
      })
      .catch(() => {
        return { valid: false } as const;
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function resumeRoomSession(roomCode: string) {
    setLoading(true);
    client
      .POST("/api/v1/resume", { body: { roomCode } })
      .then((res) => {
        if (res.error) {
          return Promise.reject();
        }

        setPlayerDetails({
          name: res.data.name,
          id: res.data.id,
          roomCode: roomCode,
        });
        setTimeout(() => navigate(`/game`), 250);
      })
      .catch(() => {
        setLoading(false);
        setResume(null);
        toast.show(
          "There was a problem resuming your session, please create a new player instead"
        );
      });
  }

  useEffect(() => {
    if (searchParams.has("z")) {
      return;
    }
    const sessionId = Math.random().toString(36).substring(2, 5);
    sessionStorage.setItem("z", sessionId);
    setSearchParams({ z: sessionId });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!searchParams.has("room")) {
      return;
    }
    const roomCode = searchParams.get("room");
    setRoomCode(roomCode);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!playerDetails.id) return;
    const abortController = new AbortController();
    client
      .GET(`/api/v1/player/{player_id}`, {
        params: {
          path: { player_id: playerDetails.id },
          query: {},
        },
        signal: abortController.signal,
      })
      .then((res) => {
        if (res.error) return;
        navigate(`/game`);
      });

    return () => {
      abortController.abort();
    };
  }, [playerDetails, navigate]);

  const bigScreenUrl = getBigScreenUrl();

  function onRoomCodeSubmit(code: string) {
    if (!code) return;
    return checkRoomCode(code).then((res) => {
      if (!res.valid) {
        setHasJoinCodeError(true);
        return { reset: true };
      }
      setRoomCode(code);
      setResume(
        res.room.resumePlayerName
          ? { room: code, name: res.room.resumePlayerName as string }
          : null
      );
      setState("join");
    });
  }

  function onNewRoom(
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    if (loading) return;
    submitVibrate();
    newRoom();
  }
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    submitVibrate();
    join();
  }

  function getBigScreenUrl() {
    const url = document?.location.host.startsWith("beta.")
      ? "beta.flop.party/big-screen"
      : "tv.flop.party";

    return roomCode ? `${url}/${roomCode}` : url;
  }

  const urlWithScheme = `https://${bigScreenUrl}`;

  return (
    <>
      <FlopLandingLayout>
        <div className="grid grid-cols-1 items-center justify-center justify-items-center gap-4 px-4 py-16 pb-0 text-slate-500 animate-fadeInFromTop">
          <h2 className="text-lg font-medium m-0 text-center min-w-48 w-9/12">
            grab a chromecast-enabled big screen, or go to:
          </h2>
          <p
            className={cn(
              "text-lg font-bold m-0 text-center text-slate-600 tracking-wider select-none cursor-pointer"
            )}
            onClick={() =>
              share.isSupported
                ? share({
                    title: "Flop Poker",
                    text: "Host a game of Flop Poker on the big screen",
                    url: urlWithScheme,
                  })
                : window.open(urlWithScheme)
            }
          >
            {bigScreenUrl}
          </p>
        </div>
        <div className="grid grid-cols-1 items-center justify-center space-y-4 gap-2 px-8 mb-16 animate-fadeInFromBottom">
          {state === "default" ? (
            <div className="grid gap-4 grid-cols-2">
              <div className="flex flex-col gap-4 col-span-2">
                <h3 className="text-md font-semibold text-center text-slate-700 pb-2">
                  Start a new room? Or join an existing one?
                </h3>
              </div>
              <FlopButton
                onClick={() => setState("new")}
                color="gray"
                variant="outline"
                label="New"
                className="transition-all duration-300 ease-in-out"
                disabled={loading}
              >
                <span className="font-semibold">New</span>
              </FlopButton>
              <FlopButton
                onClick={() => {
                  setState("room-code-entry");
                  setIsRoomEntryAnimating(true);
                }}
                color="watercourse"
                variant="solid"
                label="Join"
                className="transition-all duration-300 ease-in-out"
                disabled={loading}
              >
                <span className="font-semibold">Join</span>
              </FlopButton>
            </div>
          ) : state === "room-code-entry" ? (
            <div
              className={cn(
                "max-w-md mx-auto text-center bg-white px-4 -mb-4 sm:px-8 py-12 rounded-xl shadow relative",
                hasJoinCodeError ? "animate-shake" : "",
                isRoomEntryAnimating ? "animate-fadeIn" : ""
              )}
            >
              <CloseButton onClick={() => returnToDefaultState()} />
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1">Join Room</h1>
                <p className="text-[15px] text-slate-500">
                  Enter the 4-character code to join a room
                </p>
              </div>
              <RoomCodeInput onSubmit={onRoomCodeSubmit} submitLabel="Join" />
            </div>
          ) : state === "new" || state === "join" ? (
            <form
              onSubmit={state === "new" ? onNewRoom : onSubmit}
              autoComplete="off"
            >
              <div className="grid gap-4 grid-cols-1 pt-14 relative animate-fadeIn">
                <CloseButton onClick={() => returnToDefaultState()} />
                <input
                  ref={inputRef}
                  disabled={!!resume && state === "join"}
                  className={cn(
                    "px-6 py-4 bg-mystic-50 text-black text-xl font-medium rounded transition duration-150 ease-in-out hover:bg-slate-50 shadow-sm shadow-black/20 hover:shadow-lg",
                    hasJoinError
                      ? "ring-2 ring-red-500 ring-offset-1 focus:ring-red-500"
                      : ""
                  )}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  accessKey="n"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <FlopButton
                  type="submit"
                  color="watercourse"
                  variant="solid"
                  label="Submit"
                  className="transition-all duration-300 ease-in-out"
                  disabled={loading}
                >
                  <span className="font-semibold">
                    {state === "new" ? "New Room" : "Join Room"}
                  </span>
                </FlopButton>
              </div>
            </form>
          ) : null}
        </div>
      </FlopLandingLayout>

      <ResumeSessionModal
        resume={resume}
        setResume={setResume}
        state={state}
        resumeRoomSession={resumeRoomSession}
        disabled={loading}
      />
    </>
  );

  function returnToDefaultState() {
    setRoomCode(null);
    setState("default");
  }
}

// export const headers: HeadersFunction = ({}) => ({
//   "Cache-Control": "public, max-age=604800, s-maxage=604800",
//   "Cache-Tag": "f-ls-home",
// });

function ResumeSessionModal({
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

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="absolute top-2 right-2">
      <button
        type="button"
        aria-label="Close"
        onClick={onClick}
        className="rounded-md hover:bg-slate-200 h-10 w-10 flex items-center justify-center"
      >
        <XCircleIcon className="h-6 w-6 text-slate-500" />
      </button>
    </div>
  );
}
