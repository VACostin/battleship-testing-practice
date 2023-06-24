/* eslint-disable no-param-reassign */

import Ship from "./ship";

const BOARD_SIZE = 10;
const Gameboard = () => {
  const code = {
    empty: 0,
    ship: 1,
    miss: -1,
    hit: -2,
  };
  let allSunkFlag;
  const ships = [];
  const board = new Array(BOARD_SIZE);
  for (let i = 0; i < BOARD_SIZE; i += 1) board[i] = new Array(BOARD_SIZE);

  const isOutOfBounds = (coordinates) =>
    !Object.keys(coordinates).every(
      (s) => coordinates[s] >= 0 && coordinates[s] < BOARD_SIZE
    );

  const removeShipX = (xLine) => {
    const { x1, y } = xLine;
    let { x1Cur } = xLine;
    while (x1Cur >= x1) {
      board[x1Cur][y] = code.empty;
      x1Cur -= 1;
    }
  };

  const buildShipX = (xLine) => {
    const { x1, x2, y } = xLine;
    const ship = {
      interact: Ship(x2 - x1),
      span: [],
    };
    let x1Cur = x1;
    while (x1Cur <= x2) {
      if (board[x1Cur][y] === 0) {
        // if there's not another ship on the square
        board[x1Cur][y] = code.ship;
        ship.span.push(JSON.stringify([x1Cur, y])); // much easier to compare strings than arrays
        x1Cur += 1;
      } else {
        xLine = { x1, x1Cur, y };
        removeShipX(xLine);
        return true; // isOverlapping
      }
    }
    ships.push(ship);
    return false; // isNotOverlapping
  };

  const removeShipY = (yLine) => {
    const { x, y1 } = yLine;
    let { y1Cur } = yLine;
    while (y1Cur >= y1) {
      board[x][y1Cur] = code.empty;
      y1Cur -= 1;
    }
  };

  const buildShipY = (yLine) => {
    const { x, y1, y2 } = yLine;
    const ship = {
      interact: Ship(y2 - y1),
      span: [],
    };
    let y1Cur = y1;
    while (y1Cur <= y2) {
      if (board[x][y1Cur] === 0) {
        // if there's not another ship on the square
        board[x][y1Cur] = code.ship;
        ship.span.push(JSON.stringify([x, y1Cur])); // much easier to compare strings than arrays
        y1Cur += 1;
      } else {
        yLine = { x, y1, y1Cur };
        removeShipY(yLine);
        return true; // isOverlapping
      }
    }
    ships.push(ship);
    return false; // isNotOverlapping
  };

  const isOverlapping = (coordinates) => {
    let { x1, x2, y1, y2 } = coordinates;
    if (y1 === y2) {
      // ship placed on X axis
      if (x1 > x2) [x1, x2] = [x2, x1];
      const y = y1;
      const xLine = { x1, x2, y };
      return buildShipX(xLine);
    }
    if (x1 === x2) {
      // ship placed on Y axis
      if (y1 > y2) [y1, y2] = [y2, y1];
      const x = x1;
      const yLine = { x, y1, y2 };
      return buildShipY(yLine);
    } // not exactly overlapping but I reckon
    return true; // an L-shaped ship doesn't exist
  };

  const placeShip = (coordinates) =>
    !(isOutOfBounds(coordinates) || isOverlapping(coordinates));

  const hitShipAt = (position) => {
    const positionString = JSON.stringify(position);
    for (let i = 0; i < ships.length; i += 1) {
      const ship = ships[i];
      if (ship.span.includes(positionString)) {
        ship.interact.hit();
        return "Done";
      }
    }
    const [x, y] = position;
    throw new Error(`Tried to hit ship at unmarked position x: ${x}, y: ${y}`);
  };

  const receiveAttack = (position) => {
    if (isOutOfBounds(position)) return "Out of bounds";
    const { x, y } = position;
    switch (board[x][y]) {
      case code.empty:
        board[x][y] = code.miss;
        return "Miss";
      case code.ship:
        board[x][y] = code.hit;
        hitShipAt([x, y]);
        return "Hit";
      default:
        return "Already fired";
    }
  };

  const updateAllSunkFlag = () => {
    allSunkFlag = ships.every((ship) => ship.interact.isSunk());
    return allSunkFlag;
  };

  const isAllSunk = () => allSunkFlag || updateAllSunkFlag();

  const resetBoard = () => {
    allSunkFlag = false;
    for (let i = 0; i < BOARD_SIZE; i += 1)
      for (let j = 0; j < BOARD_SIZE; j += 1) board[i][j] = code.empty;
    while (ships.length > 0) ships.pop();
  };

  resetBoard();

  return {
    placeShip,
    receiveAttack,
    isAllSunk,
  };
};

export default Gameboard;
