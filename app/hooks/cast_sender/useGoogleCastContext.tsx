import { useEffect } from "react";
import { type GlobalCastContext } from "./types";


export function useGoogleCastContext() {
  useEffect(() => {
    const w = window as unknown as GlobalCastContext;

    console.log("checking cast ready", w.gCastReady);

    // w.gCastReady = true;
    // console.log("cast ready set to true for testing");

    if (w.gCastReady) {
      console.log("cast ready");
      loadCastFramework();
      return;
    }

    w["__onGCastApiAvailable"] = function (isAvailable: boolean) {
      if (isAvailable) {
        console.log("cast now available");
        loadCastFramework();
      }
    };
  }, []);
}

function loadCastFramework() {
  console.log("loading cast framework");
  const options: cast.framework.CastOptions = {
    receiverApplicationId: "9AF17368",
    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
  };

  cast.framework.CastContext.getInstance().setOptions(options);

  const remotePlayer = new cast.framework.RemotePlayer();
  const remotePlayerController = new cast.framework.RemotePlayerController(
    remotePlayer
  );
  remotePlayerController.addEventListener(
    cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
    (event: cast.framework.RemotePlayerChangedEvent) => {
      if (event.value === false) {
        console.log("remote player disconnected");
        return;
      }
    }
  );

  console.log("cast ready");
}
