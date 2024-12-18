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
import { useTimeoutState } from "~/hooks/useTimeoutState";
import { useToast } from "~/contexts/toaster";
import { CloseButton } from "~/components/CloseButton";
import { ResumeSessionModal } from "~/components/ResumeSessionModal";
import { useDeviceType } from "~/hooks/useDeviceType";
import { useBigScreenUrl } from "../hooks/useBigScreenUrl";

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
  const share = useShare();
  const deviceType = useDeviceType();
  const bigScreenUrl = useBigScreenUrl(roomCode);

  const bigScreenUrlWithScheme = bigScreenUrl.url.toString();
  const bigScreenUrlWithoutScheme = bigScreenUrl.displayUrl;
  const skipLandingPage = searchParams.has("ignore_device");

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
        setState("new");
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
    if (
      !deviceType.isLoading &&
      deviceType.isDesktopOrLandscape &&
      !skipLandingPage
    ) {
      navigate("/home");
    }
  }, [
    deviceType.isDesktopOrLandscape,
    deviceType.isLoading,
    skipLandingPage,
    navigate,
  ]);

  useEffect(() => {
    if (searchParams.has("z")) {
      return;
    }
    const sessionId = Math.random().toString(36).substring(2, 5);
    sessionStorage.setItem("z", sessionId);
    setSearchParams((prev) => {
      prev.set("z", sessionId);
      return prev;
    });

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

  function returnToDefaultState() {
    setRoomCode(null);
    setState("default");
  }

  if (deviceType.isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-mystic-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-watercourse-600"></div>
      </div>
    );
  }

  return (
    <>
      <FlopLandingLayout>
        <div className="grid grid-cols-1 items-center justify-center justify-items-center gap-4 px-4 pt-12 sm:pt-16 text-slate-500 text-base sm:text-lg animate-fadeInFromTop">
          <h2 className="font-medium text-center min-w-48 w-full mx-4 sm:w-9/12 sm:mx-0">
            grab a chromecast-enabled big screen, or go to:
          </h2>
          <p
            className={cn(
              "font-bold m-0 text-center text-slate-600 tracking-wider select-none cursor-pointer"
            )}
            onClick={() =>
              share.isSupported
                ? share({
                    title: "Flop Poker",
                    text: "Host a game of Flop Poker on the big screen",
                    url: bigScreenUrlWithScheme,
                  })
                : window.open(bigScreenUrlWithScheme)
            }
          >
            {bigScreenUrlWithoutScheme}
          </p>
        </div>
        <div
          className={cn(
            "relative grid grid-cols-1 items-center justify-center space-y-4 gap-2 animate-fadeInFromBottom",
            state === "default" || state === "room-code-entry" ? "h-40" : ""
          )}
        >
          {state === "default" ? (
            <div className="grid gap-x-4 gap-y-6 grid-cols-2 mx-8 mb-4 sm:mb-8 lg:mb-16">
              <div className="flex flex-col gap-4 col-span-2">
                <h3 className="text-md font-semibold text-center text-slate-700">
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
            <div className="absolute bottom-0 left-0 right-0 flex justify-center">
              <div
                className={cn(
                  "max-w-md mx-auto text-center bg-white px-4 -mb-4 py-12 rounded-xl shadow relative",
                  hasJoinCodeError ? "animate-shake" : "",
                  isRoomEntryAnimating
                    ? "animate-[fromBottom_0.3s_ease-in-out]"
                    : ""
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
            </div>
          ) : state === "new" || state === "join" ? (
            <form
              onSubmit={state === "new" ? onNewRoom : onSubmit}
              autoComplete="off"
            >
              <div className="grid gap-4 grid-cols-1 mx-8 mb-4 sm:mb-8 lg:mb-16 pt-10 sm:pt-12 relative animate-fadeIn">
                <CloseButton
                  className="absolute top-0 right-2"
                  onClick={() => returnToDefaultState()}
                />
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
                    setName(e.target.value?.trim());
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
}
