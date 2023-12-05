"use strict";

const game = (function () {
  let _shipClass;
  let _gameboardClass;
  let _playerClass;
  let _computerPlayerClass;
  let _isPlaying = false;
  let _players = [];
  let _boards = {};
  let _turnId = 1;
  let _phase = "PREGAME";

  const isPlaying = function () {
    return _isPlaying;
  };

  const setIsPlaying = function (isPlaying) {
    _isPlaying = isPlaying;
  };

  const player = function (filters) {
    if (_players.length < 1) return null;
    if (filters.hasOwnProperty("id")) {
      return _players.filter((player) => player.id === filters.id)[0];
    }
  };

  const board = function (filters) {
    if (Object.values(_boards).length < 1) return null;
    return _boards[filters.id].board;
  };

  const gameboard = function (filters) {
    if (Object.values(_boards).length < 1) return null;
    return _boards[filters.id];
  };

  const turnId = function () {
    return _turnId;
  };

  const setTurnId = function (turnId) {
    _turnId = turnId;
  };

  const switchTurns = function () {
    _turnId = _turnId === 1 ? 2 : 1;
  };

  const phase = function () {
    return _phase;
  };

  const setPhase = function (value) {
    _phase = value;
  };

  const setDependencies = function (args) {
    _shipClass = args.shipClass;
    _gameboardClass = args.gameboardClass;
    _playerClass = args.playerClass;
    _computerPlayerClass = args.computerPlayerClass;
  };

  const isMissingDependencies = function () {
    if (
      !_shipClass ||
      !_gameboardClass ||
      !_playerClass ||
      !_computerPlayerClass
    ) {
      console.error("Game module is missing dependencies!");
      return true;
    }
    return false;
  };

  const isUninitialized = function () {
    if (isMissingDependencies()) return true;
    if (_players.length !== 2) return true;
    if (Object.values(_boards).length !== 2) return true;
    return false;
  };

  const initialize = function () {
    if (isMissingDependencies()) return;
    _players = [new _playerClass(), new _computerPlayerClass()];
    const gameboardArgs = { shipClass: _shipClass };
    const player1Gameboard = new _gameboardClass(gameboardArgs);
    const player2Gameboard = new _gameboardClass(gameboardArgs);
    player2Gameboard.setPresetState();
    _boards = {
      1: player1Gameboard,
      2: player2Gameboard,
    };
    _turnId = 1;
    _isPlaying = true;
    _phase = "PLACEMENT";
  };

  const wasAttacked = function (args) {
    if (isUninitialized()) return;

    const { victimId, cell } = args;
    return _boards[victimId].isVisitedCell(cell);
  };

  const attack = function (args) {
    if (isUninitialized()) return;

    const { attackerId, victimId, cell } = args;
    if (attackerId !== _turnId) return;
    if (attackerId === victimId) return;
    _boards[victimId].receiveAttack(cell);
  };

  const isOver = function () {
    if (isUninitialized()) return false;
    if (_boards[1].areAllShipsSunk()) return true;
    if (_boards[2].areAllShipsSunk()) return true;
    return false;
  };

  const status = function () {
    if (isUninitialized()) return "Game is missing prerequisites.";
    if (!isPlaying()) return "Game is not in session.";
    if (_boards[1].areAllShipsSunk()) {
      return `Game ended: Player 2 (${player({ id: 2 }).name}) won!`;
    }
    if (_boards[2].areAllShipsSunk()) {
      return `Game ended: Player 1 (${player({ id: 1 }).name}) won!`;
    }
    if (_phase == "PLACEMENT")
      return `It is Player ${_turnId} (${
        player({ id: _turnId }).name
      })'s turn to place a ship.`;
    return `It is Player ${_turnId} (${
      player({ id: _turnId }).name
    })'s turn to attack.`;
  };

  return {
    isPlaying,
    setIsPlaying,
    player,
    board,
    gameboard,
    turnId,
    switchTurns,
    phase,
    setPhase,
    setDependencies,
    initialize,
    isOver,
    wasAttacked,
    attack,
    status,
  };
})();

export default game;
