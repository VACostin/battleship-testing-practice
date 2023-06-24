/* eslint-disable no-param-reassign */

import Ship from "./ship";

const BOARD_SIZE = 10;
const CODE = {
  empty: {
    val: 0,
    returnString: "Miss",
  },
  ship: {
    val: 1,
    returnString: "Hit",
  },
  miss: {
    val: -1,
    returnString: "Already fired",
  },
  hit: {
    val: -2,
    returnString: "Already fired",
  },
};

const Gameboard = () => {
  /**
   * @type {boolean}
   */
  let allSunkFlag = false;
  /**
   * @type {{interact: Ship, span: string[]}[]}
   */
  const ships = [];
  /**
   * @type {number[]}
   */
  const board = new Array(BOARD_SIZE);
  for (let i = 0; i < BOARD_SIZE; i += 1) board[i] = new Array(BOARD_SIZE);

  /**
   *
   * @param {{x1: number, x2: number, y1: number, y2: number}} coordinates Points defining ship's edges
   *
   * @returns {boolean}
   * @description Our board is a square constrained between 0 and {@link BOARD_SIZE}
   */
  const isOutOfBounds = (coordinates) =>
    !Object.keys(coordinates).every(
      (s) => coordinates[s] >= 0 && coordinates[s] < BOARD_SIZE
    );

  /**
   * @param {{x1: number, x1Cur: number, y: number}} xLine Horizontal line describing our ship
   * @description Reverts the board state before ship placement.
   */
  const removeShipX = (xLine) => {
    const { x1, y } = xLine;
    let { x1Cur } = xLine;
    while (x1Cur >= x1) {
      board[x1Cur][y] = CODE.empty.val;
      x1Cur -= 1;
    }
  };

  /**
   * @param {{x1: number, x1Cur: number, y: number}} xLine Horizontal line describing our ship
   * @description Attempts to place the ship on board.
   * If it cannot due to another ship, it reverts the board state.
   * @returns {boolean} isOverlapped
   */
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
        board[x1Cur][y] = CODE.ship.val;
        ship.span.push(JSON.stringify([x1Cur, y])); // much easier to compare strings than arrays
        x1Cur += 1;
      } else {
        xLine = { x1, x1Cur, y };
        removeShipX(xLine);
        return false; // isOverlapped
      }
    }
    ships.push(ship);
    return true; // isNotOverlapped
  };

  /**
   * @param {{x: number, y1: number, y1Cur: number}} yLine Vertical line describing our ship
   * @description Reverts the board state before ship placement.
   */
  const removeShipY = (yLine) => {
    const { x, y1 } = yLine;
    let { y1Cur } = yLine;
    while (y1Cur >= y1) {
      board[x][y1Cur] = CODE.empty.val;
      y1Cur -= 1;
    }
  };

  /**
   * @param {{x: number, y1: number, y1Cur: number}} yLine Vertical line describing our ship
   * @description Attempts to place the ship on board.
   * If it cannot due to another ship, it reverts the board state.
   * @returns {boolean} isOverlapped
   */
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
        board[x][y1Cur] = CODE.ship.val;
        ship.span.push(JSON.stringify([x, y1Cur])); // much easier to compare strings than arrays
        y1Cur += 1;
      } else {
        yLine = { x, y1, y1Cur };
        removeShipY(yLine);
        return false; // isOverlapped
      }
    }
    ships.push(ship);
    return true; // isNotOverlapped
  };
  /**
   * @param {{x1: number, x2: number, y1: number, y2: number}} coordinates Points defining ship's edges
   * @description returns false - the line is overlapped or L shaped.
   *              returns true - the ship has been placed successfully.
   * @returns {boolean}
   */
  const buildShip = (coordinates) => {
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
    }
    return false; // L-shaped
  };

  /**
   * @param {{x1: number, x2: number, y1: number, y2: number}} coordinates points defining ship's edges
   * @returns {boolean}
   * @example
   * let coordinates = {x: 1, x2: 3, y1: 0, y2: 0};
   * placeShip(coordinates); // returns true
   * coordinates.x = 2;
   * placeShip(coordinates); // returns false -> there's already a ship placed on at least 1 point
   */

  const placeShip = (coordinates) =>
    !(isOutOfBounds(coordinates) || !buildShip(coordinates));

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

  /**
   * @param {{x: number, y: number}} position position to attack
   * @returns {string}
   * @see {@link CODE}.key.returnString for possible return values
   */

  const receiveAttack = (position) => {
    if (isOutOfBounds(position)) return "Out of bounds";
    const { x, y } = position;
    switch (board[x][y]) {
      case CODE.empty.val:
        board[x][y] = CODE.miss.val;
        return CODE.empty.returnString;
      case CODE.ship.val:
        board[x][y] = CODE.hit.val;
        hitShipAt([x, y]);
        return CODE.ship.returnString;
      default:
        return CODE.miss.returnString;
    }
  };

  const updateAllSunkFlag = () => {
    allSunkFlag = ships.every((ship) => ship.interact.isSunk());
    return allSunkFlag;
  };

  /**
   * Checks if all ships are sunk.
   * @returns {boolean}
   */
  const isAllSunk = () => allSunkFlag || updateAllSunkFlag();

  /**
   *@description Resets all internal flags and arrays to default values
   */
  const resetBoard = () => {
    allSunkFlag = false;
    for (let i = 0; i < BOARD_SIZE; i += 1)
      for (let j = 0; j < BOARD_SIZE; j += 1) board[i][j] = CODE.empty.val;
    while (ships.length > 0) ships.pop();
  };

  resetBoard();

  return {
    placeShip,
    receiveAttack,
    isAllSunk,
    resetBoard,
  };
};

export default Gameboard;
