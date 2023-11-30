import Gameboard from "../lib/gameboard";
import Ship from "../lib/ship";

describe("Gameboard class", () => {
  describe("constructor()", () => {
    it("returns a non-null Gameboard instance if called", () => {
      const gameboardArgs = {
        shipClass: Ship,
      };
      const gameboard = new Gameboard(gameboardArgs);
      expect(gameboard).toBeTruthy();
    });
  });

  describe("placeShip()", () => {
    it("correctly updates the internal state if called on a Gameboard instance that initially has an empty board", () => {
      const gameboardArgs = {
        shipClass: Ship,
      };
      const gameboard = new Gameboard(gameboardArgs);
      const shipArgs = {
        length: 2,
        cells: [
          [5, 5],
          [6, 5],
        ],
      };
      gameboard.placeShip(shipArgs, Ship);
      expect(gameboard.ships.length).toStrictEqual(1);
      expect(gameboard.board[5][5]).toStrictEqual("ship");
      expect(gameboard.board[6][5]).toStrictEqual("ship");
    });
  });

  describe("receiveAttack()", () => {
    it("correctly updates the internal state if called with a cell that a ship occupies on a Gameboard instance that has a certain board with 1 ship ", () => {
      const gameboardArgs = {
        shipClass: Ship,
        argsOfShips: [
          {
            length: 3,
            cells: [
              [5, 7],
              [5, 8],
              [5, 9],
            ],
          },
        ],
      };
      const gameboard = new Gameboard(gameboardArgs);
      gameboard.receiveAttack([5, 7]);
      expect(gameboard.ships.length).toStrictEqual(1);
      expect(gameboard.board[5][7]).toStrictEqual("hit");
      expect(gameboard.ships[0].hitCount).toStrictEqual(1);
      expect(gameboard.isVisitedCell([5, 7])).toStrictEqual(true);
    });

    it("correctly updates the internal state if called with a cell that is empty on a Gameboard instance that has a certain board with 1 ship", () => {
      const gameboardArgs = {
        shipClass: Ship,
        argsOfShips: [
          {
            length: 3,
            cells: [
              [5, 7],
              [5, 8],
              [5, 9],
            ],
          },
        ],
      };
      const gameboard = new Gameboard(gameboardArgs);
      gameboard.receiveAttack([5, 6]);
      expect(gameboard.ships.length).toStrictEqual(1);
      expect(gameboard.board[5][6]).toStrictEqual("miss");
      expect(gameboard.ships[0].hitCount).toStrictEqual(0);
      expect(gameboard.isVisitedCell([5, 6])).toStrictEqual(true);
    });
  });

  describe("areAllShipsSunk()", () => {
    it("returns false if called on a Gameboard instance that has a certain board with no ships", () => {
      const gameboardArgs = {
        shipClass: Ship,
      };
      const gameboard = new Gameboard(gameboardArgs);
      expect(gameboard.areAllShipsSunk()).toStrictEqual(false);
    });

    it("returns false if called on a Gameboard instance that has a certain board with a non-sunk ship and a sunk ship", () => {
      const gameboardArgs = {
        shipClass: Ship,
        argsOfShips: [
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
            hitCount: 2,
            cells: [
              [5, 5],
              [6, 5],
            ],
          },
        ],
      };
      const gameboard = new Gameboard(gameboardArgs);
      expect(gameboard.areAllShipsSunk()).toStrictEqual(false);
    });

    it("returns true if called on a Gameboard instance that has a certain board with 2 sunk ships", () => {
      const gameboardArgs = {
        shipClass: Ship,
        argsOfShips: [
          {
            length: 3,
            hitCount: 3,
            cells: [
              [5, 7],
              [5, 8],
              [5, 9],
            ],
          },
          {
            length: 2,
            hitCount: 2,
            cells: [
              [5, 5],
              [6, 5],
            ],
          },
        ],
      };
      const gameboard = new Gameboard(gameboardArgs);
      expect(gameboard.areAllShipsSunk()).toStrictEqual(true);
    });
  });
});
