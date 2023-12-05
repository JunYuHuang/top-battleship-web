"use strict";

class Ship {
  #_length;
  #_hitCount;
  #_cells;
  #_orientation = "unknown";

  static cellsFromHeadCell(headCell, length, orientation) {
    if (length === 1) return [headCell];
    if (length < 1) return [];
    if (orientation === "vertical") {
      const [headRow, headCol] = headCell;
      const adjCells = [];
      for (let i = 1; i < length; i++) {
        adjCells.push([headRow + i, headCol]);
      }
      return [headCell, ...adjCells];
    }
    if (orientation === "horizontal") {
      const [headRow, headCol] = headCell;
      const adjCells = [];
      for (let i = 1; i < length; i++) {
        adjCells.push([headRow, headCol + i]);
      }
      return [headCell, ...adjCells];
    }
    return [];
  }

  constructor(args) {
    this.#_length = args.length;
    this.#_hitCount = args.hasOwnProperty("hitCount") ? args.hitCount : 0;
    this.#_cells = args.cells;
    this.#_orientation = args.hasOwnProperty("orientation")
      ? args.orientation
      : "unknown";
  }

  get length() {
    return this.#_length;
  }

  set length(value) {
    this.#_length = value;
  }

  get hitCount() {
    return this.#_hitCount;
  }

  set hitCount(value) {
    this.#_hitCount = value;
  }

  get cells() {
    return this.#_cells;
  }

  set cells(values) {
    this.#_cells = values;
  }

  get orientation() {
    return this.#_orientation;
  }

  set orientation(value) {
    this.#_orientation = value;
  }

  hit() {
    if (this.#_hitCount >= this.#_length) return;
    this.#_hitCount++;
  }

  isSunk() {
    return this.#_hitCount >= this.#_length;
  }

  onCell(cell) {
    return this.#_cells.some(
      (shipCell) => shipCell.toString() === cell.toString(),
    );
  }
}

export default Ship;
