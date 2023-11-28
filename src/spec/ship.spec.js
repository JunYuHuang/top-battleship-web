import Ship from "../lib/ship";

describe("Ship class", () => {
  describe("constructor()", () => {
    it("returns a non-null Ship instance if called", () => {
      const shipArgs = {
        length: 2,
        hitCount: 1,
        cells: [
          [0, 1],
          [0, 2],
        ],
      };
      const ship = new Ship(shipArgs);
      expect(ship).toBeTruthy();
    });
  });

  describe("hit()", () => {
    it("correctly updates the internal state if called on a Ship instance that has a hitCount of 0", () => {
      const shipArgs = {
        length: 2,
        cells: [
          [0, 1],
          [0, 2],
        ],
      };
      const ship = new Ship(shipArgs);
      ship.hit();
      expect(ship.hitCount).toStrictEqual(1);
    });

    it("correctly updates the internal state if called on a Ship instance that has a hitCount of 1", () => {
      const shipArgs = {
        length: 2,
        hitCount: 1,
        cells: [
          [0, 1],
          [0, 2],
        ],
      };
      const ship = new Ship(shipArgs);
      ship.hit();
      expect(ship.hitCount).toStrictEqual(2);
    });

    it("does not update the internal state if called on a Ship instance that has a hitCount of 2 and a length of 2", () => {
      const shipArgs = {
        length: 2,
        hitCount: 2,
        cells: [
          [0, 1],
          [0, 2],
        ],
      };
      const ship = new Ship(shipArgs);
      ship.hit();
      expect(ship.hitCount).toStrictEqual(2);
    });
  });

  describe("isSunk()", () => {
    it("returns false if called on a Ship instance that has a hitCount of 0 and a length of 2", () => {
      const shipArgs = {
        length: 2,
        cells: [
          [0, 1],
          [0, 2],
        ],
      };
      const ship = new Ship(shipArgs);
      expect(ship.isSunk()).toStrictEqual(false);
    });

    it("returns true if called on a Ship instance that has a hitCount of 2 and a length of 2", () => {
      const shipArgs = {
        length: 2,
        hitCount: 2,
        cells: [
          [0, 1],
          [0, 2],
        ],
      };
      const ship = new Ship(shipArgs);
      expect(ship.isSunk()).toStrictEqual(true);
    });

    it("returns true if called on a Ship instance that has a hitCount of 3 and a length of 2", () => {
      const shipArgs = {
        length: 2,
        hitCount: 3,
        cells: [
          [0, 1],
          [0, 2],
        ],
      };
      const ship = new Ship(shipArgs);
      expect(ship.isSunk()).toStrictEqual(true);
    });
  });

  describe("onCell()", () => {
    it("returns false if called with '[0,0]' on a Ship instance that has a certain cells matrix", () => {
      const shipArgs = {
        length: 2,
        hitCount: 0,
        cells: [
          [0, 1],
          [0, 2],
        ],
      };
      const ship = new Ship(shipArgs);
      expect(ship.onCell([0, 0])).toStrictEqual(false);
    });

    it("returns true if called with '[0,1]' on a Ship instance that has a certain cells matrix", () => {
      const shipArgs = {
        length: 2,
        hitCount: 0,
        cells: [
          [0, 1],
          [0, 2],
        ],
      };
      const ship = new Ship(shipArgs);
      expect(ship.onCell([0, 1])).toStrictEqual(true);
    });
  });
});
