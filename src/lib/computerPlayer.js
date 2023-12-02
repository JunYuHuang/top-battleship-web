"use strict";

import Player from "./player";

class ComputerPlayer extends Player {
  #_visitedCells = new Set();

  constructor(options = {}) {
    const defaultArgs = {
      name: "Computer Player",
      id: 2,
      type: "computer",
    };
    options.name = options.hasOwnProperty("name")
      ? options.name
      : defaultArgs.name;
    options.id = options.hasOwnProperty("id") ? options.id : defaultArgs.id;
    options.type = options.hasOwnProperty("type")
      ? options.type
      : defaultArgs.type;

    super(options);
    if (options.hasOwnProperty("visitedCells")) {
      this.#_visitedCells = new Set(
        options.visitedCells.map((cell) => cell.toString()),
      );
    }
  }

  get visitedCells() {
    return this.#_visitedCells;
  }

  set visitedCells(values) {
    this.#_visitedCells = values;
  }

  randomMove(board) {
    const validCells = [];
    const rows = board.length;
    const cols = board[0].length;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (this.#_visitedCells.has([r, c].toString())) continue;
        if (board[r][c] === "hit") continue;
        if (board[r][c] === "miss") continue;
        validCells.push([r, c]);
      }
    }
    if (validCells.length < 1) throw new Error("No available moves!");
    const randomPos = Math.floor(Math.random() * validCells.length);
    this.#_visitedCells.add(validCells[randomPos].toString());
    return validCells[randomPos];
  }
}

export default ComputerPlayer;
