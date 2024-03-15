import { RecoilEnv, atom } from "recoil";
import { components } from "./flopClient/spec";

// Grim workaround to stop dev environment warnings
// https://github.com/facebookexperimental/Recoil/issues/733#issuecomment-1404481267
RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

export type GamePlayerState = components["schemas"]["GamePlayerState"];

const initialPlayerState: GamePlayerState = {
  balance: 0,
  state: "offline",
  yourTurn: false,
  cards: [
    ["clubs", "ace"],
    ["clubs", "2"],
  ],
  callAmount: 0,
  minRaiseBy: 0,
  currentRoundStake: 0,
  turnExpiresDt: new Date().getTime(),
  lastUpdate: new Date().getTime(),
};

export const playerState = atom({
  key: "playerState",
  default: initialPlayerState,
});

export const playerDetailsState = atom({
  key: "playerDetails",
  default: {
    name: "",
    id: "",
  },
});

export const devState = atom({
  key: "devState",
  default: {
    showSwitchboard: false,
  },
});
