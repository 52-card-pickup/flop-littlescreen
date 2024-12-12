/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ArrowRightCircleIcon,
  ArrowRightEndOnRectangleIcon,
  CameraIcon,
  CurrencyPoundIcon,
  TvIcon,
} from "@heroicons/react/20/solid";
import cn from "~/utils/cn";
import { client } from "~/flopClient";
import usePlayerDetails from "~/hooks/usePlayerDetails";
import { useTimeoutState } from "~/hooks/useTimeoutState";
import { createPortal } from "react-dom";
import FlopButton from "./FlopButton";
import { PlayerPhotoCameraOverlay } from "./PlayerPhotoCamera";
import { FlopMenuButtonIcon } from "./FlopMenuButtonIcon";
import { useDocument } from "../hooks/useDocument";
import { CloseButton } from "./CloseButton";
import { useToast } from "~/contexts/toaster";

export default function PlayerSendButton() {
  const { playerDetails } = usePlayerDetails();
  const [preview, setPreview] = useTimeoutState<string | null>(null, 750);
  const [sendMoneyModalOpen, setSendMoneyModalOpen] = useState(false);
  const [showCameraOverlay, setShowCameraOverlay] = useState(false);
  const [showScreenPairOverlay, setShowScreenPairOverlay] = useState(false);
  const [leaveGameModalOpen, setLeaveGameModalOpen] = useState(false);

  function sendEmoji(payload: string, preview: string) {
    console.log("Sending emoji", payload);
    setPreview(preview);
    client.POST("/api/v1/player/{player_id}/send", {
      params: {
        // @ts-expect-error - required for player_id path param
        path: { player_id: playerDetails.id },
      },
      body: {
        message: payload,
      },
    });
  }

  function leaveGame() {
    client.POST("/api/v1/player/{player_id}/leave", {
      params: {
        // @ts-expect-error - required for player_id path param
        path: { player_id: playerDetails.id },
      },
    });
  }

  function openSendMoneyModal() {
    setSendMoneyModalOpen(true);
  }

  return (
    <>
      <SendPlayerMoneyModal
        open={sendMoneyModalOpen}
        onClose={() => setSendMoneyModalOpen(false)}
      />
      <PairBigScreenModal
        open={showScreenPairOverlay}
        onClose={() => setShowScreenPairOverlay(false)}
      />
      <ConfirmModal
        open={leaveGameModalOpen}
        onClose={() => setLeaveGameModalOpen(false)}
        onConfirm={leaveGame}
        confirmText="Leave"
        cancelText={null}
      >
        Are you sure you want to leave the game?
      </ConfirmModal>
      {showCameraOverlay && (
        <PlayerPhotoCameraOverlay
          onCompleted={() => setShowCameraOverlay(false)}
        />
      )}
      <FullScreenEmojiPreview hidden={!preview} emoji={preview || ""} />
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => (
          <>
            <div>
              <Menu.Button
                className="inline-flex justify-center items-center gap-x-1.5 w-12 h-20 text-xl font-semibold text-watercourse-50 relative
              focus:outline-none focus:ring-0"
                aria-label="Open actions menu"
                role="button"
              >
                <FlopMenuButtonIcon className="w-full h-full" open={open} />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-300"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                className="absolute bottom-24 right-0 z-10 mt-2 w-60 origin-bottom-right divide-y divide-gray-300
          rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-30 overflow-hidden opacity-95 focus:outline-none"
              >
                <div className="py-1 bg-red-700">
                  <Menu.Item>
                    <a
                      onClick={() => setLeaveGameModalOpen(true)}
                      role="menuitem"
                      className={cn(
                        "flex items-center px-4 py-2 font-medium text-xl text-gray-100"
                      )}
                    >
                      <ArrowRightEndOnRectangleIcon
                        className="mr-3 h-6 w-6 text-red-50"
                        aria-hidden="true"
                      />
                      Leave the game
                    </a>
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    <a
                      onClick={() => setShowScreenPairOverlay(true)}
                      role="menuitem"
                      className={cn(
                        "flex items-center px-4 py-2 font-medium text-xl text-gray-700"
                      )}
                    >
                      <TvIcon
                        className="mr-3 h-6 w-6 text-gray-700"
                        aria-hidden="true"
                      />
                      Link TV with code
                    </a>
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    <a
                      onClick={() => setShowCameraOverlay(true)}
                      role="menuitem"
                      className={cn(
                        "flex items-center px-4 py-2 font-medium text-xl text-gray-700"
                      )}
                    >
                      <CameraIcon
                        className="mr-3 h-6 w-6 text-gray-700"
                        aria-hidden="true"
                      />
                      Take a picture
                    </a>
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    <a
                      onClick={() => openSendMoneyModal()}
                      role="menuitem"
                      className={cn(
                        "flex items-center px-4 py-2 font-medium text-xl text-gray-700"
                      )}
                    >
                      <CurrencyPoundIcon
                        className="mr-3 h-6 w-6 text-gray-700"
                        aria-hidden="true"
                      />
                      Send money
                    </a>
                  </Menu.Item>
                </div>
                <div className="py-1 bg-watercourse-900 ring-t-4 ring-black">
                  <Menu.Item disabled>
                    <span
                      className={cn(
                        "flex items-center px-4 py-2 font-medium text-xl text-white"
                      )}
                    >
                      <ArrowRightCircleIcon
                        className="mr-3 h-6 w-6"
                        aria-hidden="true"
                      />
                      Send a reaction
                    </span>
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <div className="grid grid-cols-4 gap-1 px-2 py-1 pb-2">
                        <EmojiButton
                          payload=":+1:"
                          active={active}
                          onClick={sendEmoji}
                        >
                          👍
                        </EmojiButton>
                        <EmojiButton
                          payload=":-1:"
                          active={active}
                          onClick={sendEmoji}
                        >
                          👎
                        </EmojiButton>
                        <EmojiButton
                          payload=":clapping:"
                          active={active}
                          onClick={sendEmoji}
                        >
                          👏
                        </EmojiButton>
                        <EmojiButton
                          payload=":time:"
                          active={active}
                          onClick={sendEmoji}
                        >
                          ⏳
                        </EmojiButton>
                        <EmojiButton
                          payload=":thinking:"
                          active={active}
                          onClick={sendEmoji}
                        >
                          🤔
                        </EmojiButton>
                        <EmojiButton
                          payload=":money:"
                          active={active}
                          onClick={sendEmoji}
                        >
                          💰
                        </EmojiButton>
                        <EmojiButton
                          payload=":angry:"
                          active={active}
                          onClick={sendEmoji}
                        >
                          😡
                        </EmojiButton>
                      </div>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </>
  );
}

function EmojiButton(props: {
  payload: string;
  active: boolean;
  onClick: (payload: string, preview: string) => void;
  children: string;
}) {
  return (
    <a
      onClick={() => props.onClick(props.payload, props.children)}
      className={cn(
        props.active
          ? "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:border-gray-200"
          : "text-gray-700",
        "group flex items-center justify-center px-1 py-1 border border-black/60 bg-white rounded-md shadow-md",
        "font-bold text-2xl cursor-pointer select-none font-emoji"
      )}
    >
      {props.children}
    </a>
  );
}

function FlopModal(props: {
  children: React.ReactNode | React.ReactNode[];
  open: boolean;
  onClose: () => void;
  hasError?: boolean;
  shakeOnError?: boolean;
}) {
  const documentRef = useDocument();

  // listen for escape key or location change
  useEffect(() => {
    if (!documentRef) return;

    const locationListener = (e: PopStateEvent) => {
      e.preventDefault();
      props.onClose();
    };

    const kbListener = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        props.onClose();
      }
    };

    documentRef.addEventListener("keydown", kbListener);
    window.addEventListener("popstate", locationListener);
    return () => {
      documentRef.removeEventListener("keydown", kbListener);
      window.removeEventListener("popstate", locationListener);
    };
  }, [documentRef, props.onClose]);

  if (!documentRef) return null;
  return createPortal(
    <Transition
      as={Fragment}
      show={props.open}
      enter="transition transform duration-100"
      enterFrom="transform origin-center scale-0 opacity-0"
      enterTo="transform origin-center scale-100 opacity-100"
      leave="transition transform duration-100"
      leaveFrom="transform origin-center scale-100 opacity-100"
      leaveTo="transform origin-center scale-0 opacity-0"
    >
      <div
        className={cn(
          "fixed w-screen h-screen left-0 top-0 inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center transition-colors",
          props.hasError ? "bg-gray-600/50" : "bg-black/20"
        )}
        onClick={(e) => e.target === e.currentTarget && props.onClose()}
      >
        <div
          className={cn(
            "relative max-w-[70vw] bg-white p-6 pt-10 rounded-lg grid gap-6 justify-center items-center justify-items-center",
            props.hasError
              ? "shadow-sm shadow-red-800"
              : "shadow-xl shadow-black/20",
            props.shakeOnError && props.hasError ? "animate-shake" : ""
          )}
        >
          <CloseButton onClick={props.onClose} />
          {props.children}
        </div>
      </div>
    </Transition>,
    documentRef?.body
  );
}

function ConfirmModal(props: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string | null;
}) {
  return (
    <FlopModal open={props.open} onClose={props.onClose}>
      <h2 className="text-xl font-bold text-center pb-2">{props.children}</h2>
      <div
        className={cn(
          "grid items-center gap-4",
          props.cancelText === null ? "grid-cols-1" : "grid-cols-2"
        )}
      >
        {props.cancelText !== null && (
          <FlopButton onClick={props.onClose} color="gray" variant="outline">
            {props.cancelText || "Cancel"}
          </FlopButton>
        )}
        <FlopButton
          onClick={props.onConfirm}
          color="watercourse"
          variant="solid"
        >
          {props.confirmText || "Confirm"}
        </FlopButton>
      </div>
    </FlopModal>
  );
}

function PairBigScreenModal(props: { open: boolean; onClose: () => void }) {
  const { playerDetails } = usePlayerDetails();
  const [sending, setPairing] = useState(false);
  const [input, setInput] = useState("");
  const [hasError, setHasError] = useTimeoutState(false, 1000);

  const toast = useToast();

  function pair() {
    if (!playerDetails.roomCode) return;
    setPairing(true);
    client
      .POST("/api/v1/pair", {
        body: {
          roomCode: playerDetails.roomCode,
          screenCode: input,
        },
      })
      .then((resp) => {
        if (resp.error) {
          toast.show("Failed to pair screen. Check the code and try again.");
          setHasError(true);
          return;
        }
        setInput("");
        props.onClose();
      })
      .finally(() => {
        setPairing(false);
      });
  }

  function cancel() {
    setInput("");
    props.onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    pair();
  }

  return (
    <FlopModal
      open={props.open}
      onClose={props.onClose}
      hasError={hasError}
      shakeOnError
    >
      <div className="grid gap-2">
        <form
          className="grid justify-center items-center gap-4"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-bold text-center">
            Enter the pair code from the big screen
          </h2>
          <div className="grid justify-center items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 6))}
              maxLength={6}
              disabled={sending}
              placeholder="Pair code"
              className="w-full px-3 py-2 text-xl border border-gray-300 rounded-lg"
            />
          </div>
          <FlopButton
            disabled={sending || !/^\d{6}$/.test(input)}
            color="watercourse"
            variant="solid"
            type="submit"
          >
            Pair
          </FlopButton>
        </form>
      </div>
    </FlopModal>
  );
}

function SendPlayerMoneyModal(props: { open: boolean; onClose: () => void }) {
  const documentRef = useDocument();
  const { playerDetails } = usePlayerDetails();
  const [sending, setSending] = useState(false);
  const [players, setPlayers] = useState<{ name: string; accountId: string }[]>(
    []
  );
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );

  const [input, setInput] = useState("");
  const parsed = parseInt(input, 10);
  const amount = isNaN(parsed) ? 0 : parsed;

  useEffect(() => {
    if (!playerDetails.id) return;
    if (!props.open) return;
    client
      .GET("/api/v1/player/{player_id}/transfer", {
        params: {
          // @ts-expect-error - required for player_id path param
          path: { player_id: playerDetails.id },
        },
      })
      .then((data) => {
        if (!data.data) return;
        setPlayers(data.data?.accounts);
      });
  }, [playerDetails.id, props.open]);

  function sendMoney() {
    if (!selectedAccountId || amount <= 0) return;
    setSending(true);
    client
      .POST("/api/v1/player/{player_id}/transfer", {
        params: {
          // @ts-expect-error - required for player_id path param
          path: { player_id: playerDetails.id },
        },
        body: {
          amount,
          to: selectedAccountId,
        },
      })
      .then(() => {
        setInput("");
        props.onClose();
      })
      .finally(() => {
        setSending(false);
      });
  }

  function cancel() {
    setInput("");
    props.onClose();
  }

  if (!documentRef) return null;
  return createPortal(
    <Transition
      as={Fragment}
      show={props.open}
      enter="transition transform duration-100"
      enterFrom="transform origin-center scale-0 opacity-0"
      enterTo="transform origin-center scale-100 opacity-100"
      leave="transition transform duration-100"
      leaveFrom="transform origin-center scale-100 opacity-100"
      leaveTo="transform origin-center scale-0 opacity-0"
    >
      <div
        className="fixed w-screen h-screen left-0 top-0 inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center"
        onClick={(e) => e.target === e.currentTarget && props.onClose()}
      >
        <div className="bg-white max-w-[70vw] p-6 rounded-lg grid grid-rows-[auto,auto,auto] gap-6 justify-center items-center justify-items-center shadow-xl shadow-black/20">
          <h2 className="text-xl font-bold text-center pb-2">
            Who do you want to send money to?
          </h2>
          <div className="grid justify-center items-center gap-2">
            <select
              value={selectedAccountId || ""}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              disabled={sending || players.length === 0}
              className="w-full px-3 py-2 text-xl border border-gray-300 rounded-lg bg-white shadow-sm shadow-black/20"
            >
              <option value="">Select player</option>
              {players.map((player) => (
                <option key={player.accountId} value={player.accountId}>
                  {player.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
              placeholder="Amount"
              className="w-full px-3 py-2 text-xl border border-gray-300 rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 justify-center items-center gap-4">
            <FlopButton
              onClick={cancel}
              disabled={sending}
              color="gray"
              variant="outline"
            >
              Cancel
            </FlopButton>
            <FlopButton
              onClick={sendMoney}
              disabled={sending || amount <= 0 || !selectedAccountId}
              color="watercourse"
              variant="solid"
            >
              Send
            </FlopButton>
          </div>
        </div>
      </div>
    </Transition>,
    documentRef?.body
  );
}

function FullScreenEmojiPreview(props: { hidden?: boolean; emoji: string }) {
  const documentRef = useDocument();
  if (!documentRef) return null;

  return createPortal(
    <div
      className={cn(
        "fixed w-screen h-screen left-0 top-0 inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center",
        props.hidden ? "hidden" : ""
      )}
    >
      <Transition
        as={Fragment}
        show={!props.hidden}
        enter="transition transform duration-100"
        enterFrom="transform origin-center scale-0 opacity-20"
        enterTo="transform origin-center scale-100 opacity-100"
        leave="transition transform duration-100"
        leaveFrom="transform origin-center scale-100 opacity-100"
        leaveTo="transform origin-center scale-0 opacity-0"
      >
        <div className="absolute bottom-1/3 p-4 bg-white/20 rounded-full shadow-xl shadow-black/20 m-auto px-[10%]">
          <div className="text-[120px]">{props.emoji}</div>
        </div>
      </Transition>
    </div>,
    documentRef.body
    // document.body
  );
}
