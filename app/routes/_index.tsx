import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import usePlayerDetails from "~/hooks/usePlayerDetails";
import { devState } from "~/state";
import { client } from "../flopClient";
import FlopButton from "~/components/FlopButton";
import { ShareButton } from "~/components/ShareButton";
import cn from "~/utils/cn";

export default function Index() {
  const setDev = useSetRecoilState(devState);
  const { playerDetails, setPlayerDetails } = usePlayerDetails();
  const [name, setName] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [knockResult, setKnockResult] = React.useState<
    "playing" | "joinable" | null
  >(null);
  const navigate = useNavigate();

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
    if (name && name === playerDetails.name) {
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
      })
      .finally(() => {});
  }

  useEffect(() => {
    if (knockResult === null || knockResult === "joinable") return;
    const timeout = setTimeout(() => {
      setKnockResult(null);
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [knockResult]);

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
  }, [playerDetails]);

  return (
    <div
      className="bg-slate-200 min-h-screen grid grid-flow-row grid-rows-[auto,5fr,auto,1fr]"
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}
    >
      <div className="grid grid-cols-1 items-center justify-center gap-4 px-16 py-16 pb-0 text-slate-500">
        <h2 className="text-base font-bold m-0 text-center">
          Not got a Chromecast? Grab a big screen and go to:
        </h2>
        <p className="text-lg font-semibold m-0 text-center text-slate-600">
          tv.flop.party
        </p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold my-12 text-center">flop.</h1>
        <h2 className="text-base font-semibold my-1 text-center">
          No chips, no cards, no table?
        </h2>
        <h2 className="text-base font-semibold my-1 text-center">
          No problem.
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
          join();
        }}
        autoComplete="off"
        className="grid grid-cols-1 items-center justify-center space-y-4 gap-4 px-8"
      >
        <input
          className="px-6 py-4 bg-slate-300 text-black text-xl font-normal rounded transition duration-150 ease-in-out hover:bg-slate-50 shadow-sm shadow-black/20 hover:shadow-lg"
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <div
          className={cn(
            "grid gap-4",
            knockResult === "joinable"
              ? "grid-cols-[1fr]"
              : "grid-cols-[1fr,5fr]"
          )}
        >
          {knockResult !== "joinable" && (
            <FlopButton
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                client
                  .POST("/api/v1/room/knock", { body: { which: "peek" } })
                  .then((res) => {
                    if (res.data?.state === "playing") {
                      setKnockResult("playing");
                    } else {
                      setKnockResult("joinable");
                    }
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }}
              color="gray"
              variant="outline"
              className={cn(
                "opacity-80 transition-all duration-300 ease-in-out",
                knockResult === "playing" ? "animate-shake" : ""
              )}
              disabled={loading || !!knockResult}
            >
              Knock
            </FlopButton>
          )}

          <FlopButton
            type="submit"
            color="blue"
            variant="solid"
            className="transition-all duration-300 ease-in-out"
            disabled={loading}
          >
            Join
          </FlopButton>
        </div>
      </form>
    </div>
  );
}
