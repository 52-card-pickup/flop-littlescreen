/* eslint-disable jsx-a11y/no-access-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect } from "react";
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
  const inputRef = React.useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
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
        setHasJoinError(true);
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
            {/* <div className="text-sm text-slate-500 mt-4">
              Don't have a code?{" "}
              <a
                className="font-medium text-indigo-500 hover:text-indigo-600"
                onClick={() => setState("new")}
              >
                Create a new Room
              </a>
            </div> */}
          </div>
        ) : state === "new" || state === "join" ? (
          <form onSubmit={roomCode ? onSubmit : onNewRoom} autoComplete="off">
            <div className="grid gap-4 grid-cols-1 pt-14 relative animate-fadeIn">
              <CloseButton onClick={() => returnToDefaultState()} />
              <input
                ref={inputRef}
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
  );

  function returnToDefaultState() {
    setRoomCode(null);
    setState("default");
  }
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="absolute top-2 right-2">
      <button
        type="button"
        onClick={onClick}
        className="rounded-md hover:bg-slate-200 h-10 w-10 flex items-center justify-center"
      >
        <XCircleIcon className="h-6 w-6 text-slate-500" />
      </button>
    </div>
  );
}
