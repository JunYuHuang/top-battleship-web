import ComputerPlayer from "../lib/computerPlayer";

function emptyBoard() {
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

function missBoard() {
  const res = [];
  for (let r = 0; r < 10; r++) {
    const row = [];
    for (let c = 0; c < 10; c++) {
      row.push("miss");
    }
    res.push(row);
  }
  return res;
}

describe("ComputerPlayer class", () => {
  describe("constructor()", () => {
    it("returns a non-null ComputerPlayer instance if called", () => {
      expect(new ComputerPlayer()).toBeTruthy();
    });
  });

  describe("randomAttack()", () => {
    it("throws an error if called with a board that has no empty or unvisited ship cells on a ComputerPlayer instance", () => {
      const board = missBoard();
      board[5][5] = "ship";
      board[6][5] = "ship";
      const options = {
        visitedCells: [
          [5, 5],
          [6, 5],
        ],
      };
      const computerPlayer = new ComputerPlayer(options);
      expect(() => {
        computerPlayer.randomAttack(board);
      }).toThrow();
    });

    it("returns a random unvisited cell if called with a board that has unvisited empty or unvisited ship cells on a ComputerPlayer instance", () => {
      const board = emptyBoard();
      board[0][0] = "miss";
      board[5][5] = "ship";
      board[6][5] = "ship";
      const options = {
        visitedCells: [[0, 0]],
      };
      const computerPlayer = new ComputerPlayer(options);
      const expectedCells = new Set(["empty", "ship"]);
      const [resRow, resCol] = computerPlayer.randomAttack(board);
      expect(expectedCells.has(board[resRow][resCol])).toStrictEqual(true);
    });
  });
});
