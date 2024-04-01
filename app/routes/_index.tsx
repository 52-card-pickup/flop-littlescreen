import React from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import usePlayerDetails from "~/hooks/usePlayerDetails";
import { devState } from "~/state";
import { client } from "../flopClient";
import FlopButton from "~/components/FlopButton";

export default function Index() {
  const setDev = useSetRecoilState(devState);
  const [name, setname] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { setPlayerDetails } = usePlayerDetails();

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
        if (res.data) {
          setPlayerDetails({
            name,
            id: res.data.id,
          });
          setTimeout(() => navigate(`/game`), 250);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      })
      .finally(() => {});
  }

  return (
    <div
      className="bg-slate-200 min-h-screen grid grid-flow-row grid-rows-[3fr,auto,1fr]"
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}
    >
      <div className="flex justify-center items-center">
        <h1 className="text-4xl font-bold my-6 shadow-sm text-center">flop.</h1>
      </div>
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
            setname(e.target.value);
          }}
        />
        <div className="grid grid-cols-2 gap-4">
          <FlopButton type="submit" color="gray" disabled={loading}>
            Join
          </FlopButton>

          <FlopButton
            type="button"
            onClick={() => {
              client.POST("/api/v1/room/reset");
            }}
            color="red"
            variant="solid"
            disabled={loading}
          >
            Reset
          </FlopButton>
        </div>
      </form>
    </div>
  );
}
