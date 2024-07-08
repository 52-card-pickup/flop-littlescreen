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
  const [name, setName] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [hasJoinError, setHasJoinError] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const submitVibrate = useVibrate([5], 5);
  const [searchParams, setSearchParams] = useSearchParams();
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
      .POST("/api/v1/join", { body: { name } })
      .then((res) => {
        if (res.error) {
          return Promise.reject();
        }

        setPlayerDetails({
          name,
          id: res.data.id,
        });
        setTimeout(() => navigate(`/game`), 250);
      })
      .catch((err) => {
        inputRef.current?.focus();
        setHasJoinError(true);
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

  const bigScreenUrl = document?.location.host.startsWith("beta.")
    ? "beta.flop.party/big-screen"
    : "tv.flop.party";

  return (
    <FlopLandingLayout>
      <div className="grid grid-cols-1 items-center justify-center gap-4 px-16 py-16 pb-0 text-slate-500 animate-fadeInFromTop">
        <h2 className="text-lg font-medium m-0 text-center">
          grab a chromecast-enabled big screen, or go to:
        </h2>
        <p
          className={cn(
            "text-lg font-semibold m-0 text-center text-slate-600 select-none cursor-pointer"
          )}
          onClick={() =>
            share.isSupported
              ? share({
                  title: "Flop Poker",
                  text: "Host a game of Flop Poker on the big screen",
                  url: `https://${bigScreenUrl}`,
                })
              : window.open(`https://${bigScreenUrl}`)
          }
        >
          {bigScreenUrl}
        </p>
      </div>
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (loading) return;
          submitVibrate();
          join();
        }}
        autoComplete="off"
        className="grid grid-cols-1 items-center justify-center space-y-4 gap-2 px-8 mb-16 animate-fadeInFromBottom"
      >
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
        <div className={cn("grid gap-4")}>
          <FlopButton
            type="submit"
            color="watercourse"
            variant="solid"
            className="transition-all duration-300 ease-in-out"
            disabled={loading}
          >
            <span className="font-semibold">Join</span>
          </FlopButton>
        </div>
      </form>
    </FlopLandingLayout>
  );
}
