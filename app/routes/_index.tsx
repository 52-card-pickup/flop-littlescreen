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
import { ShareButton } from "~/components/ShareButton";
import { useShare } from "~/hooks/useShare";
import cn from "~/utils/cn";
import { useSearchParams } from "@remix-run/react";
import { useVibrate } from "~/hooks/useVibrate";
import FlopBrandLogoText from "~/components/FlopBrandLogoText";

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
        if (!res.data) {
          setLoading(false);
          return;
        }

        setPlayerDetails({
          name,
          id: res.data.id,
        });
        setTimeout(() => navigate(`/game`), 250);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
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
    <div
      className="w-screen h-screen grid grid-flow-row grid-rows-[auto,5fr,auto] overflow-hidden"
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}
    >
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
      <div className="flex flex-col justify-center items-center animate-scaleIn">
        <>
          <FlopBrandLogoText
            className="w-40 h-40 mb-8 animate-scaleIn"
            aria-label="flop."
          />
        </>
        <h2 className="text-2xl font-medium my-1 text-center text-watercourse-900/80 animate-fadeIn">
          no chips, no cards, no table?
        </h2>
        <h2 className="text-2xl font-medium my-1 text-center text-watercourse-900/80 animate-fadeIn">
          no problem.
        </h2>
      </div>
      <ShareButton
        className="fixed top-8 right-8 w-8 h-8"
        title="Flop Poker"
        text="Play Flop Poker with your friends"
        url="https://flop.poker"
      />
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
          className="px-6 py-4 bg-mystic-50 text-black text-xl font-medium rounded transition duration-150 ease-in-out hover:bg-slate-50 shadow-sm shadow-black/20 hover:shadow-lg"
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
    </div>
  );
}
