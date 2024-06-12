import React from "react";

type ShareButtonProps = React.HTMLProps<HTMLDivElement> & {
  title: string;
  text: string;
  url: string;
};

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

export function ShareButton(props: ShareButtonProps) {
  const share = useShare();

  return (
    <div {...props}>
      <button
        className="flex justify-center items-center h-full w-full max-w-[48px] max-h-[48px] border-none"
        onClick={() =>
          share({
            title: props.title,
            text: props.text,
            url: props.url,
          })
        }
      >
        {share.isSupported && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
