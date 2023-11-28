"use strict";

class Ship {
  #_length;
  #_hitCount;
  #_cells;

  constructor(args) {
    this.#_length = args.length;
    this.#_hitCount = args.hasOwnProperty("hitCount") ? args.hitCount : 0;
    this.#_cells = args.cells;
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
