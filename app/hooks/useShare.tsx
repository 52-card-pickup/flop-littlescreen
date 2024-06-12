import React from "react";

let hasWarnedAboutCanShare = false;

export function useShare() {
  const [canShare, setCanShare] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const canShare: typeof navigator.canShare | null =
      typeof window !== "undefined" &&
      "navigator" in window &&
      "canShare" in window.navigator
        ? (data?: ShareData | undefined) => {
            try {
              return window.navigator.canShare(data);
            } catch (e) {
              console.error(e);
              return false;
            }
          }
        : null;

    if (!canShare) {
      if (hasWarnedAboutCanShare) return;
      console.log("Unable to share, canShare is not supported");
      hasWarnedAboutCanShare = true;
      return;
    }

    const exampleShareData = {
      title: "Flop Poker",
      text: "Play Flop Poker with your friends",
      url: "https://flop.party",
    };

    const shareEnabled = canShare(exampleShareData);
    if (!shareEnabled) {
      console.log("Unable to share", exampleShareData);
    }

    setCanShare(shareEnabled);
  }, []);

  function share(data: ShareData) {
    if (!canShare) {
      console.log("Unable to share, share is not supported");
      return;
    }
    window.navigator.share(data);
  }

  share.isSupported = canShare || false;
  return share;
}
