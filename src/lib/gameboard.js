"use strict";

class Gameboard {
  #_ROWS = 10;
  #_COLS = 10;
  #_MAX_SHIPS = 5;
  #_SHIP_SIZE_ORDER = [5, 4, 3, 3, 2];

  /*
   * String matrix that that represents each cell on the board
   * with a string from the set { "empty", "miss", "ship", "hit" }.
   */
  #_board = [];

  #_visitedCells = new Set(); // set of stringified cells ([row, col])
  #_ships = []; // array of `Ship` instances
  #_shipClass;

  get ROWS() {
    return this.#_ROWS;
  }

  get COLS() {
    return this.#_COLS;
  }

  get MAX_SHIPS() {
    return this.#_MAX_SHIPS;
  }

  get SHIP_SIZE_ORDER() {
    return this.#_SHIP_SIZE_ORDER;
  }

  get shipClass() {
    return this.#_shipClass;
  }

  set shipClass(value) {
    this.#_shipClass = value;
  }

  get board() {
    return this.#_board;
  }

  set board(value) {
    this.#_board = value;
  }

  get visitedCells() {
    return this.#_visitedCells;
  }

  set visitedCells(values) {
    this.#_visitedCells = values;
  }

  get ships() {
    return this.#_ships;
  }

  set ships(values) {
    this.#_ships = values;
  }

  static blankBoard() {
    const res = [];
    for (let r = 0; r < 10; r++) {
      const row = [];
      for (let c = 0; c < 10; c++) {
        row.push("empty");
      }
      res.push(row);
    }
    return res;
  }

  static presetState(shipClass) {
    const argsOfShips = [
      {
        length: 5,
        cells: [
          [1, 4],
          [1, 5],
          [1, 6],
          [1, 7],
          [1, 8],
        ],
      },
      {
        length: 4,
        cells: [
          [2, 1],
          [3, 1],
          [4, 1],
          [5, 1],
        ],
      },
      {
        length: 3,
        cells: [
          [8, 2],
          [8, 3],
          [8, 4],
        ],
      },
      {
        length: 3,
        cells: [
          [5, 7],
          [5, 8],
          [5, 9],
        ],
      },
      {
        length: 2,
        cells: [
          [5, 5],
          [6, 5],
        ],
      },
    ];

    const board = Gameboard.blankBoard();
    const ships = [];
    for (const shipArgs of argsOfShips) {
      const ship = new shipClass(shipArgs);
      ships.push(ship);
      for (const cell of ship.cells) {
        const [row, col] = cell;
        board[row][col] = "ship";
      }
    }
    return {
      ships,
      board,
      visitedCells: new Set(),
    };
  }

  constructor(args) {
    this.#_shipClass = args.shipClass;
    this.#_board = args.hasOwnProperty("board")
      ? args.board
      : Gameboard.blankBoard();
    if (args.hasOwnProperty("visitedCells")) {
      this.#_visitedCells = new Set(
        args.visitedCells.map((cell) => cell.toString()),
      );
    }
    if (
      args.hasOwnProperty("argsOfShips") &&
      args.hasOwnProperty("shipClass")
    ) {
      args.argsOfShips.forEach((shipArgs) => {
        this.placeShip(shipArgs, args.shipClass);
      });
    }
  }

  setPresetState() {
    if (!this.#_shipClass) return;
    const { ships, board, visitedCells } = Gameboard.presetState(
      this.#_shipClass,
    );
    this.#_ships = ships;
    this.#_board = board;
    this.#_visitedCells = visitedCells;
  }

  isValidBoard(board = this.#_board) {
    if (!Array.isArray(board)) return false;
    if (board.length !== this.#_ROWS) return false;
    const validCells = new Set(["empty", "miss", "ship", "hit"]);
    for (const row of board) {
      if (row.length !== this.#_COLS) return false;
      for (const cell of row) {
        if (!validCells.has(cell)) return false;
      }
    }
    return true;
  }

  isInboundCell(cell) {
    if (!Array.isArray(cell)) return false;
    if (cell.length != 2) return false;

    const [row, col] = cell;
    if (!Number.isInteger(row)) return false;
    if (!Number.isInteger(col)) return false;
    if (row < 0 || row >= this.#_ROWS) return false;
    if (col < 0 || col >= this.#_COLS) return false;
    return true;
  }

  isEmptyCell(cell) {
    if (!this.isInboundCell(cell)) return false;
    const [row, col] = cell;
    return this.#_board[row][col] === "empty";
  }

  isMissedCell(cell) {
    if (!this.isInboundCell(cell)) return false;
    const [row, col] = cell;
    return this.#_board[row][col] === "miss";
  }

  isShipCell(cell) {
    if (!this.isInboundCell(cell)) return false;
    const [row, col] = cell;
    return this.#_board[row][col] === "ship";
  }

  isVisitedCell(cell) {
    if (!this.isInboundCell(cell)) return false;
    return this.#_visitedCells.has(cell.toString());
  }

  indexOfShipOnCell(cell) {
    if (!this.isShipCell(cell)) return -1;
    if (this.#_ships.length < 1) return -1;
    for (let i = 0; i < this.#_ships.length; i++) {
      if (this.#_ships[i].onCell(cell)) return i;
    }
    return -1;
  }

  canPlaceShips() {
    return this.#_ships.length < this.#_MAX_SHIPS;
  }

  shipSizeToPlace() {
    if (this.#_ships.length < 0) return 0;
    if (this.#_ships.length >= this.#_MAX_SHIPS) return 0;
    return this.#_SHIP_SIZE_ORDER[this.#_ships.length];
  }

  hasShipArgs(shipArgs) {
    if (!Number.isInteger(shipArgs.length)) return false;
    if (!Number.isInteger(shipArgs.hitCount)) return false;
    if (!Array.isArray(shipArgs.cells)) return false;
    if (typeof shipArgs.orientation !== "string") return false;
    const { length, hitCount, cells, orientation } = shipArgs;
    if (length < 1) return false;
    if (hitCount < 0 || hitCount > length) return false;
    if (orientation !== "vertical" && orientation !== "horizontal")
      return false;
    if (cells.length !== length) return false;
    const visit = new Set();
    for (const cell of cells) {
      if (!this.isInboundCell(cell)) return false;
      const cellStr = cell.toString();
      if (visit.has(cellStr)) return false;
      visit.add(cellStr);
    }
    return true;
  }

  isVerticalShip(shipArgs) {
    if (shipArgs.orientation !== "vertical") return false;
    if (shipArgs.cells.length === 1) return true;
    const cells = shipArgs.cells.sort();
    let prevCell = cells[0];
    for (let i = 1; i < cells.length; i++) {
      const [row, col] = cells[i];
      const [prevRow, prevCol] = prevCell;

      if (col !== prevCol) return false;
      if (row !== prevRow + 1) return false;
      prevCell = cells[i];
    }
    return true;
  }

  isHorizontalShip(shipArgs) {
    if (shipArgs.orientation !== "horizontal") return false;
    if (shipArgs.cells.length === 1) return true;
    const cells = shipArgs.cells.sort();
    let prevCell = cells[0];
    for (let i = 1; i < cells.length; i++) {
      const [row, col] = cells[i];
      const [prevRow, prevCol] = prevCell;
      if (row !== prevRow) return false;
      if (col !== prevCol + 1) return false;
      prevCell = cells[i];
    }
    return true;
  }

  canPlaceShip(shipArgs) {
    if (!this.hasShipArgs(shipArgs)) return false;
    for (const cell of shipArgs.cells) {
      if (!this.isEmptyCell(cell)) return false;
    }
    return this.isVerticalShip(shipArgs) || this.isHorizontalShip(shipArgs);
  }

  placeShip(shipArgs, shipClass = this.#_shipClass) {
    const ship = new shipClass(shipArgs);
    this.#_ships.push(ship);
    ship.cells.forEach((cell) => {
      const [row, col] = cell;
      this.#_board[row][col] = "ship";
    });
  }

  receiveAttack(cell) {
    if (!this.isInboundCell(cell)) return;
    if (this.isVisitedCell(cell)) return;
    if (this.#_ships.length < 1) return;

    const [row, col] = cell;
    if (this.isShipCell(cell)) {
      const index = this.indexOfShipOnCell(cell);
      if (index === -1) return;
      this.#_ships[index].hit();
      this.#_board[row][col] = "hit";
    } else {
      this.#_board[row][col] = "miss";
    }
    this.#_visitedCells.add(cell.toString());
  }

  areAllShipsSunk() {
    if (this.#_ships.length < 1) return false;
    let count = 0;
    for (const ship of this.#_ships) {
      if (ship.isSunk()) count++;
    }
    return count === this.#_ships.length;
  }
}

export default Gameboard;
