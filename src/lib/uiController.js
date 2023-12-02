"use strict";

const uiController = (function () {
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
    if (player1BoardRootElement) {
      player1BoardRootElement.addEventListener("click", handleCellButton);
    }
    if (player2BoardRootElement) {
      player2BoardRootElement.addEventListener("click", handleCellButton);
    }
  };

  const baseCellComponent = function (args) {
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
    if (playerId !== 1 && playerId !== 2) return;

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
          cell = emptyCellComponent(args);
        } else {
          cell = cellToComponent[board[r][c]](args);
        }
        boardRoot.appendChild(cell);
      }
    }
  };

  const renderStatus = function (status = "") {
    if (isMissingDependencies()) return;
    statusElement.textContent = status;
  };

  const handleCellButton = function (e) {
    if (isMissingDependencies()) return;
    if (!game.isPlaying()) return;

    const button = e.target;
    if (button.dataset.input !== "cell-button") return;
    const victimId = Number.parseInt(button.dataset.playerId);
    if (game.turnId() === victimId) return;

    const attackArgs = {
      attackerId: game.turnId(),
      victimId,
      cell: [
        Number.parseInt(button.dataset.row),
        Number.parseInt(button.dataset.col),
      ],
    };
    if (game.wasAttacked(attackArgs)) return;

    game.attack(attackArgs);
    renderBoard({
      board: game.board({ id: 1 }),
      playerId: 1,
      hideShips: false,
    });
    renderBoard({
      board: game.board({ id: 2 }),
      playerId: 2,
      hideShips: true,
    });

    if (game.isOver()) {
      renderStatus(game.status());
      game.setIsPlaying(false);
      return;
    }

    game.switchTurns();
    renderStatus(game.status());

    const isComputerTurn =
      game.player({ id: game.turnId() }).type === "computer";
    if (isComputerTurn) {
      const computerPlayer = game.player({ id: game.turnId() });
      const attackArgs = {
        attackerId: game.turnId(),
        victimId: game.turnId() === 1 ? 2 : 1,
        cell: computerPlayer.randomMove(game.board({ id: game.turnId() })),
      };
      game.attack(attackArgs);
      renderBoard({
        board: game.board({ id: 1 }),
        playerId: 1,
        hideShips: false,
      });
      renderBoard({
        board: game.board({ id: 2 }),
        playerId: 2,
        hideShips: true,
      });

      if (game.isOver()) {
        renderStatus(game.status());
        game.setIsPlaying(false);
        return;
      }

      game.switchTurns();
      renderStatus(game.status());
    }
  };

  return {
    setDependencies,
    renderBoard,
    renderStatus,
    addEventListeners,
  };
})();

export default uiController;
