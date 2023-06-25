import Gameboard from "./gameboard";

const CODE = {
  hit: "Hit",
  miss: "Miss",
  gameOver: "Game over",
  notYourTurn: "Not your turn",
}
/**
 * @param {boolean} goingFirst
 */
function Player(goingFirst) {
  let turn = goingFirst;
  /**
   * @type {Player} player
   */
  let opposingPlayer;
  const gameboard = Gameboard();

  /**
   * @param {Player} player
   * @description Needed for Player vs AI battles
   */
  const setOpponent = (player) => {
    opposingPlayer = player;
  };
  /**
   * @param {{x1: number, x2: number, y1: number, y2: number}} coordinates Points defining ship's edges
   * @description returns false - the line is overlapped or L shaped.
   *              returns true - the ship has been placed successfully.
   * @returns {boolean}
   */
  const placeShip = (coordinates) => gameboard.placeShip(coordinates);

  const toggleFlag = () => {
    turn = !turn;
  };

  const toggleFlags = () => {
    toggleFlag();
    opposingPlayer.toggleFlag();
  };
  /**
   * @param {string} returnString
   * @description If game is over returns {@link GAME_END_MSG} and locks player actions.
   * Otherwise keep playing
   */
  const checkGameState = (returnString) => {
    if (gameboard.isAllSunk()) {
      opposingPlayer.toggleFlag();
      return CODE.gameOver;
    }
    return returnString;
  };
  /**
   * @param {{x: number, y: number}} position position to attack
   * @returns {string}
   * @see {@link CODE}.key for the return values that interest us
   */
  const fire = (position) => {
    if (!turn) return CODE.notYourTurn;
    const returnString = gameboard.receiveAttack(position);
    switch (returnString) {
      case CODE.miss:
        toggleFlags();
        return returnString;
      case CODE.hit:
        toggleFlags();
        return checkGameState(returnString);
      default:
        return returnString;
    }
  };

  const reset = () => {
    gameboard.reset();
    turn = goingFirst;
  };

  return {
    setOpponent,
    placeShip,
    toggleFlag,
    fire,
    reset,
  };
}

export default Player;
