/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Fragment, useEffect, useRef } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ArrowRightCircleIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/20/solid";
import cn from "~/utils/cn";
import { client } from "~/flopClient";
import usePlayerDetails from "~/hooks/usePlayerDetails";
import { useTimeoutState } from "~/hooks/useTimeoutState";
import { createPortal } from "react-dom";

export default function PlayerSendButton() {
  const { playerDetails } = usePlayerDetails();
  const [preview, setPreview] = useTimeoutState<string | null>(null, 750);

  function sendEmoji(payload: string, preview: string) {
    console.log("Sending emoji", payload);
    setPreview(preview);
    client.POST("/api/v1/player/{player_id}/send", {
      params: {
        path: { player_id: playerDetails.id },
      },
      body: {
        message: payload,
      },
    });
  }

  return (
    <>
      <FullScreenEmojiPreview hidden={!preview} emoji={preview || ""} />
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex justify-center items-center gap-x-1.5 rounded-full bg-white w-12 h-12 text-xl font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <PaperAirplaneIcon
              className="h-6 w-6 text-gray-500"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute bottom-14 right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item disabled>
                <a
                  href="#"
                  className={cn(
                    "flex items-center px-4 py-2 text-xl text-gray-700"
                  )}
                >
                  <ArrowRightCircleIcon
                    className="mr-3 h-6 w-6 text-gray-600"
                    aria-hidden="true"
                  />
                  Send a reaction
                </a>
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div className="grid grid-cols-4 gap-1 divide-x divide-gray-100 px-2 py-1">
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
        "group flex items-center justify-center border border-transparent px-1 py-1 text-2xl cursor-pointer select-none font-emoji"
      )}
    >
      {props.children}
    </a>
  );
}

function FullScreenEmojiPreview(props: { hidden?: boolean; emoji: string }) {
  const documentRef = useRef<Document>();
  useEffect(() => {
    documentRef.current = document;
  }, []);
  if (!documentRef.current) return null;

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
    documentRef.current.body
    // document.body
  );
}
