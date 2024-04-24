import { useEffect, useState } from "react";
import { type GlobalCastContext } from "./types";

export function useGoogleCastContext() {
  const [castContext, setCastContext] =
    useState<cast.framework.CastSession | null>(null);

  function start() {
    loadCastFramework((session) => setCastContext(session));
  }

  useEffect(() => {
    const w = window as unknown as GlobalCastContext;

    console.log("checking cast ready", w.gCastReady);

    // w.gCastReady = true;
    // console.log("cast ready set to true for testing");

    if (w.gCastReady) {
      console.log("cast ready");
      start();
      return;
    }

    w["__onGCastApiAvailable"] = function (isAvailable: boolean) {
      if (isAvailable) {
        console.log("cast now available");
        start();
      }
    };
  }, []);

  useEffect(() => {
    console.log("cast context changed", castContext);
    if (!castContext) return;
    const timeout = setInterval(() => {
      // castContext.sendMessage("urn:x-cast:com.google.cast.tp.heartbeat", {});
      // send dummy keepalive message to receiver
      // https://stackoverflow.com/questions/50414540/keep-chromecast-caf-receiver-alive-after-sender-disconnect
      const message = new chrome.cast.media.LoadRequest({
        contentId: "https://example.com/fake/z00123.pic-o-me.jpg",
        contentType: "image/jpeg",
        metadata: {},
        streamType: chrome.cast.media.StreamType.OTHER,
      });
      castContext
        .loadMedia(message)
        .then(() => {})
        .catch(() => {
          return;
        })
        .finally(() => {
          console.log("cast receiver keepalive message sent");
        });
    }, 9_000);

    return () => {
      clearInterval(timeout);
    };
  }, [castContext]);
}

function loadCastFramework(
  onSession: (session: cast.framework.CastSession | null) => void
): cast.framework.CastContext | null {
  console.log("loading cast framework");
  const options: cast.framework.CastOptions = {
    receiverApplicationId: "9AF17368",
    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
  };

  const context = cast.framework.CastContext.getInstance();
  context.setOptions(options);

  const remotePlayer = new cast.framework.RemotePlayer();
  const remotePlayerController = new cast.framework.RemotePlayerController(
    remotePlayer
  );
  remotePlayerController.addEventListener(
    cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
    (event: cast.framework.RemotePlayerChangedEvent) => {
      if (event.value === true) {
        console.log("remote player connected");
        onSession(context.getCurrentSession());
        return;
      }
      if (event.value === false) {
        console.log("remote player disconnected");
        onSession(null);
        return;
      }
    }
  );

  console.log("cast ready");
  return context;
}
