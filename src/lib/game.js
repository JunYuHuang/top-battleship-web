"use strict";

const game = (function () {
  let _shipClass;
  let _gameboardClass;
  let _playerClass;
  let _computerPlayerClass;
  let _uiControllerModule;
  let _players = [];
  let _boards = {};
  let _turnId = 1;

  const turnId = function () {
    return _turnId;
  };

  const setTurnId = function (turnId) {
    _turnId = turnId;
  };

  const switchTurns = function () {
    _turnId = _turnId === 1 ? 2 : 1;
  };

  const player = function (filters) {
    if (_players.length < 1) return null;
    if (filters.hasOwnProperty("id")) {
      return _players.filter((player) => player.id === filters.id)[0];
    }
  };

  const setDependencies = function (args) {
    _shipClass = args.shipClass;
    _gameboardClass = args.gameboardClass;
    _playerClass = args.playerClass;
    _computerPlayerClass = args.computerPlayerClass;
    _uiControllerModule = args.uiControllerModule;
  };

  const isMissingDependencies = function () {
    if (
      !_shipClass ||
      !_gameboardClass ||
      !_playerClass ||
      !_computerPlayerClass ||
      !_uiControllerModule
    )
      return true;
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
    player1Gameboard.setPresetState();
    const player2Gameboard = new _gameboardClass(gameboardArgs);
    player2Gameboard.setPresetState();
    _boards = {
      1: player1Gameboard,
      2: player2Gameboard,
    };
    _turnId = 1;
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
    if (isUninitialized()) return "Game has not started yet.";
    if (_boards[1].areAllShipsSunk()) {
      return `Player 1 (${player({ id: 1 }).name}) won!`;
    }
    if (_boards[2].areAllShipsSunk()) {
      return `Player 2 (${player({ id: 2 }).name}) won!`;
    }
    return `It is player ${_turnId} (${
      player({ id: _turnId }).name
    })'s turn to attack.`;
  };

  return {
    turnId,
    switchTurns,
    player,
    setDependencies,
    initialize,
    isOver,
    attack,
    status,
  };
})();

export default game;