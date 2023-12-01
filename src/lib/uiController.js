"use strict";

const UIController = (function () {
  let player1BoardRootElement;
  let player2BoardRootElement;
  let statusElement;
  let game;
  const cellToComponent = {
    empty: (args) => emptyCellComponent(args),
    miss: (args) => missCellComponent(args),
    ship: (args) => shipCellComponent(args),
    hit: (args) => hitCellComponent(args),
  };

  const setDependencies = function (args) {
    player1BoardRootElement = args.player1BoardRootElement;
    player2BoardRootElement = args.player2BoardRootElement;
    statusElement = args.statusElement;
    game = args.game;
  };

  const isMissingDependencies = function () {
    if (
      !player1BoardRootElement ||
      !player2BoardRootElement ||
      !statusElement ||
      !game
    ) {
      console.error("Missing UIController dependencies!");
      return true;
    }
    return false;
  };

  const addEventListeners = function () {
    // TODO
  };

  const baseCellComponent = function (args) {
    // TODO
    const defaultStyles =
      "board-cell w-10 h-10 min-w-full min-h-full text-4xl".split(" ");
    const { cell, playerId, text, cssClasses } = args;
    const [row, col] = cell;
    const element = document.createElement("button");
    element.dataset.input = "cell-button";
    element.dataset.row = row;
    element.dataset.col = col;
    element.dataset.playerId = playerId;
    element.textContent = text;
    element.classList.add(...defaultStyles, ...cssClasses);
    return element;
  };

  const emptyCellComponent = function (args = {}) {
    args.text = "";
    args.cssClasses = "bg-white".split(" ");
    return baseCellComponent(args);
  };

  const missCellComponent = function (args = {}) {
    args.text = "•";
    args.cssClasses = "bg-white text-gray-600".split(" ");
    return baseCellComponent(args);
  };

  const shipCellComponent = function (args = {}) {
    args.text = "";
    args.cssClasses = "bg-gray-400".split(" ");
    return baseCellComponent(args);
  };

  const hitCellComponent = function (args = {}) {
    args.text = "×";
    args.cssClasses = "bg-gray-400 text-red-900".split(" ");
    return baseCellComponent(args);
  };

  const renderBoard = function (args) {
    if (isMissingDependencies()) return;
    const { board, playerId, hideShips } = args;
    if (playerId !== 1 || playerId !== 2) return;

    const boardRoot =
      playerId === 1 ? player1BoardRootElement : player2BoardRootElement;
    boardRoot.replaceChildren();

    const rows = board.length;
    const cols = board[0].length;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let args = { cell: [r, c], playerId };
        let cell;
        if (hideShips && board[r][c] === "ship") {
          cell = shipCellComponent(args);
        } else {
          cell = cellToComponent[board[r][c]](args);
        }
        boardRoot.appendChild(cell);
      }
    }
  };

  const renderStatus = function (status = "") {
    if (isMissingDependencies()) return;
    if (status !== "") {
      statusElement.textContent = status;
    }
  };

  const handleCellButton = function (e) {
    // TODO
    const button = e.target;
    if (button.dataset.input !== "cell-button") return;
  };

  return {
    setDependencies,
  };
})();
