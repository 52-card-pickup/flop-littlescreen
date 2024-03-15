import React from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import usePlayerDetails from "~/hooks/usePlayerDetails";
import { devState } from "~/state";
import { client } from "../flopClient";

export default function Index() {
  const setDev = useSetRecoilState(devState);
  const [name, setname] = React.useState<string>("");
  const navigate = useNavigate();
  const { setPlayerDetails } = usePlayerDetails();

  return (
    <div
      className="bg-slate-200 min-h-screen grid grid-flow-row grid-rows-[1fr,1fr,1fr]"
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}
    >
      <h1 className="text-4xl font-bold my-6 shadow-sm text-center">flop.</h1>
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (name === "dev") {
            setDev({ showSwitchboard: true });
            setPlayerDetails({
              name: "dev",
              id: "dev",
            });
            navigate(`/game`);
            return;
          }
          client
            .POST("/api/v1/join", { body: { name } })
            .then((res) => {
              if (res.data) {
                setPlayerDetails({
                  name,
                  id: res.data.id,
                });
                navigate(`/game`);
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }}
        className="flex flex-col items-center justify-center space-y-4"
      >
        <input
          className="px-4 py-2 bg-slate-300 text-black rounded hover:bg-slate-400 transition duration-150 ease-in-out"
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
          onChange={(e) => {
            setname(e.target.value);
          }}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-french_gray-300 text-white rounded hover:bg-blue-700 transition duration-150 ease-in-out"
        >
          Join
        </button>

        <button
          type="button"
          onClick={() => {
            client.POST("/api/v1/room/reset");
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-150 ease-in-out"
        >
          Reset
        </button>
      </form>
    </div>
  );
}
