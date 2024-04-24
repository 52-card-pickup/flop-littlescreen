/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { SVGAttributes, useEffect, useRef, useState } from "react";
import { client } from "~/flopClient";
import usePlayerDetails from "~/hooks/usePlayerDetails";
import FlopButton from "./FlopButton";
import { createPortal } from "react-dom";

export function PlayerPhotoCamera(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) {
  const [isCameraAvailable, setCameraAvailable] = useState(false);
  const [showCameraOverlay, setShowCameraOverlay] = useState(false);

  useEffect(() => {
    if (
      !("mediaDevices" in navigator) ||
      !navigator.mediaDevices.enumerateDevices
    ) {
      setCameraAvailable(false);
      return;
    }
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const hasCamera = devices.some(
          (device) => device.kind === "videoinput"
        );
        setCameraAvailable(hasCamera);
      })
      .catch(() => setCameraAvailable(false));
  }, []);
  return (
    <div {...props}>
      <div className="relative w-full h-full flex justify-center items-center">
        <FlopButton
          color="blue"
          variant="solid"
          slim={true}
          disabled={!isCameraAvailable}
          onClick={() => setShowCameraOverlay(true)}
        >
          <CameraIcon className="w-full h-full max-w-8 max-h-8 mx-3 my-2" />
        </FlopButton>
      </div>
      {showCameraOverlay && (
        <PlayerPhotoCameraOverlay
          onCompleted={() => setShowCameraOverlay(false)}
        />
      )}
    </div>
  );
}

function PlayerPhotoCameraOverlay(props: { onCompleted?: () => void }) {
  const { playerDetails, loading: playerDetailsLoading } = usePlayerDetails();
  const [showInstructions, setShowInstructions] = useState(true);
  const [loading, setLoading] = useState(false);
  async function upload(file: File) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await client.POST("/api/v1/player/{player_id}/photo", {
        params: {
          path: { player_id: playerDetails.id },
        },
        body: [formData],
        bodySerializer: (body) => body[0],
      });
      if (res.error) {
        throw new Error("Upload failed");
      }
      props.onCompleted?.();
    } catch (e) {
      setShowInstructions(true);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }
  return createPortal(
    <div
      className="fixed top-0 left-0 w-full h-full p-8 bg-black bg-opacity-50 flex justify-center items-center z-30"
      onClick={(e) => e.target === e.currentTarget && props.onCompleted?.()}
    >
      {showInstructions ? (
        <div className="bg-white p-6 rounded-lg text-black grid grid-rows-[auto,1fr] gap-2 shadow-md shadow-slate-800/20">
          <h2 className="text-xl font-bold">Take a photo</h2>
          <p>
            Snap a pic of yourself to use as your photo up on the big screen!
          </p>
          <div className="flex justify-center items-center mt-4">
            <FlopButton onClick={() => setShowInstructions(false)}>
              Open Camera
            </FlopButton>
          </div>
        </div>
      ) : (
        <CameraPreview
          onPhotoTaken={(file) => {
            upload(file);
          }}
          onError={(err) => {
            console.error(err);
            setShowInstructions(true);
          }}
        />
      )}
      {(loading || playerDetailsLoading) && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-40">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-slate-700"></div>
        </div>
      )}
    </div>,
    document.body
  );
}

function CameraPreview(props: {
  onPhotoTaken: (file: File) => void;
  onError?: (error: Error) => void;
}) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [shuttingDown, setShuttingDown] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onPhotoTaken = props.onPhotoTaken;
  const onError = props.onError;

  useEffect(() => {
    if (!videoRef.current || shuttingDown) return;
    let video: HTMLVideoElement | null = videoRef.current;
    let mediaStream: MediaStream | null = null;

    function start() {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" }, audio: false })
        .then((stream) => {
          mediaStream = stream;

          stream.addEventListener("removetrack", (e) => {
            console.log("track removed", e);
          });

          if (!video) return;
          video.srcObject = mediaStream;
          console.log("playing video stream");
          video.play();
          video.addEventListener(
            "canplay",
            () => {
              if (!video) return;
              const aspectRatio = video.videoWidth / video.videoHeight;
              setAspectRatio((prev) => prev || aspectRatio);
            },
            false
          );
        })
        .catch((err) => {
          console.error(`An error occurred: ${err}`);
          onError &&
            onError(err instanceof Error ? err : new Error("Unknown error"));
        });
    }

    function stop() {
      console.log("stopping video stream");
      // (video?.srcObject as MediaStream | null)
      //   ?.getTracks()
      //   .forEach((track) => track.stop());
      mediaStream?.getTracks().forEach((track) => {
        track.stop();
        mediaStream?.removeTrack(track);
      });
      video = null;
    }

    start();

    return () => {
      stop();
    };
  }, [onError, shuttingDown]);

  useEffect(() => {
    if (!photo) return;
    setShuttingDown(true);
  }, [photo]);

  useEffect(() => {
    if (!shuttingDown || !photo) return;
    onPhotoTaken(photo);
    setPhoto(null);
  }, [shuttingDown, photo, onPhotoTaken]);

  function takePhoto() {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    const { videoWidth, videoHeight } = videoRef.current;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

    const type = "image/jpeg";

    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "photo.jpg", { type });
      setPhoto(file);
    }, type);
  }

  return (
    <div className="bg-white p-4 rounded-lg grid grid-rows-[1fr, auto] gap-4 justify-center items-center">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        className="h-full rounded-xl shadow-md shadow-slate-800/20"
        style={{ aspectRatio: aspectRatio || "16/9" }}
      >
        Video stream not available.
      </video>
      <FlopButton
        disabled={!aspectRatio || shuttingDown}
        onClick={() => takePhoto()}
      >
        Take photo
      </FlopButton>
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}

function CameraIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      fill="none"
      strokeWidth={1.5}
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
      />
    </svg>
  );
}
