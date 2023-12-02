"use strict";

import "./styles.css";
import Ship from "./lib/ship";
import Gameboard from "./lib/gameboard";
import Player from "./lib/player";
import ComputerPlayer from "./lib/computerPlayer";
import uiController from "./lib/uiController";
import game from "./lib/game";

if (process.env.NODE_ENV !== "production") {
  console.log("App running in dev mode!");
}

game.setDependencies({
  shipClass: Ship,
  gameboardClass: Gameboard,
  playerClass: Player,
  computerPlayerClass: ComputerPlayer,
});
game.initialize();

window.addEventListener("load", function (event) {
  uiController.setDependencies({
    player1BoardRootElement: document.querySelector("#player-1-board-root"),
    player2BoardRootElement: document.querySelector("#player-2-board-root"),
    statusElement: document.querySelector("#status"),
    game: game,
  });

  uiController.addEventListeners();
  uiController.renderStatus(game.status());
  uiController.renderBoard({
    board: game.board({ id: 1 }),
    playerId: 1,
    hideShips: false,
  });
  uiController.renderBoard({
    board: game.board({ id: 2 }),
    playerId: 2,
    hideShips: true,
  });
});
