import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { playerDetailsState } from "~/state";

// a hook which hides getting and setting of playerDetails behind a localstorage cache
export default function usePlayerDetails() {
  const [playerDetails, setPlayerDetailsRecoilState] =
    useRecoilState(playerDetailsState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!window.localStorage) return;
    const saved = window.localStorage.getItem("playerDetails");
    if (saved) {
      setPlayerDetailsRecoilState(JSON.parse(saved));
    }
    setLoading(false);
  }, [setPlayerDetailsRecoilState]);

  const setPlayerDetails = (newPlayerDetails: typeof playerDetails) => {
    window.localStorage.setItem(
      "playerDetails",
      JSON.stringify(newPlayerDetails)
    );
    setPlayerDetailsRecoilState(newPlayerDetails);
  };

  return {
    playerDetails,
    setPlayerDetails,
    loading,
  };
}
