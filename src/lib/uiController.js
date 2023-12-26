"use strict";

const uiController = (function () {
  let player1BoardRootElement;
  let player2BoardRootElement;
  let statusElement;
  let shipOrientationSelect;
  let shipOrientationWrapper;
  let game;
  let shipClass;
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
    shipOrientationSelect = args.shipOrientationSelect;
    shipOrientationWrapper = args.shipOrientationWrapper;
    game = args.game;
    shipClass = args.shipClass;
  };

  const isMissingDependencies = function () {
    if (
      !player1BoardRootElement ||
      !player2BoardRootElement ||
      !statusElement ||
      !shipOrientationSelect ||
      !shipOrientationWrapper ||
      !game ||
      !shipClass
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

  const hideShipOrientationSelect = function () {
    if (isMissingDependencies()) return;
    if (shipOrientationWrapper.classList.contains("hidden")) return;
    shipOrientationWrapper.classList.add("hidden");
  };

  const handlePlaceShip = function (button) {
    if (game.phase() !== "PLACEMENT") return;
    const ownerId = Number.parseInt(button.dataset.playerId);
    if (game.turnId() !== ownerId) return;
    const gameboard = game.gameboard({ id: ownerId });
    if (!gameboard.canPlaceShips()) return;

    const headCell = [
      Number.parseInt(button.dataset.row),
      Number.parseInt(button.dataset.col),
    ];
    const shipArgs = {
      length: gameboard.shipSizeToPlace(),
      hitCount: 0,
      orientation: shipOrientationSelect.value,
      cells: shipClass.cellsFromHeadCell(
        headCell,
        gameboard.shipSizeToPlace(),
        shipOrientationSelect.value,
      ),
    };
    if (gameboard.canPlaceShip(shipArgs)) {
      gameboard.placeShip(shipArgs);
      renderBoard({
        board: gameboard.board,
        playerId: game.turnId(),
        hideShips: false,
      });
      if (gameboard.shipSizeToPlace() === 0) {
        game.setPhase("ATTACK");
        hideShipOrientationSelect();
        renderStatus(game.status());
      }
    }
  };

  const handleAttack = function (button) {
    if (game.phase() !== "ATTACK") return;
    const victimId = Number.parseInt(button.dataset.playerId);
    const board = game.board({ id: victimId });
    const gameboard = game.gameboard({ id: victimId });
    if (gameboard.canPlaceShips()) return;
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
      const otherPlayer = game.player({ id: game.turnId() === 1 ? 2 : 1 });
      const attackArgs = {
        attackerId: computerPlayer.id,
        victimId: otherPlayer.id,
        cell: computerPlayer.randomAttack(game.board({ id: otherPlayer.id })),
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

  const handleCellButton = function (e) {
    if (isMissingDependencies()) return;
    if (!game.isPlaying()) return;
    const button = e.target;
    if (button.dataset.input !== "cell-button") return;
    handlePlaceShip(button);
    handleAttack(button);
  };

  return {
    setDependencies,
    renderBoard,
    renderStatus,
    addEventListeners,
  };
})();

export default uiController;
