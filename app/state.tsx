import { components } from "./flopClient/spec";
import { atom } from "recoil";
type GameClientRoom = components["schemas"]["GameClientRoom"];
type GamePlayerState = components["schemas"]["GamePlayerState"];

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
  turnExpiresDt: new Date().getTime(),
  lastUpdate: new Date().getTime(),
};

const initialGameState: GameClientRoom = {
  cards: [],
  players: [],
  lastUpdate: new Date().getTime(),
  pot: 0,
  state: "offline",
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

export const gameState = atom({
  key: "gameState",
  default: initialGameState,
});
