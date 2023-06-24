import Gameboard from "../src/gameboard";

const BOARD_SIZE = 10;
const gameboard = Gameboard();

describe("Placing ships", () => {
  let inputArray;
  beforeAll(() => {
    // [[Xstart, Ystart], [Xend, Yend]]
    inputArray = [
      { x1: 0, y1: 0, x2: -2, y2: 0 }, // Out of bounds
      { x1: 0, y1: BOARD_SIZE, x2: -3, y2: BOARD_SIZE + 1 }, // Out of bounds
      { x1: 1, y1: 1, x2: 2, y2: 3 }, // L shaped
      { x1: 7, y1: 0, x2: 3, y2: 0 }, // VALID X-axis ship
      { x1: 0, y1: 0, x2: 4, y2: 0 }, // Overlapped X-axis ship
      { x1: 4, y1: 5, x2: 4, y2: 2 }, // VALID Y-axis ship
      { x1: 4, y1: 1, x2: 4, y2: 2 }, // Overlapped Y-axis ship
    ];
  });

  test("Placing ship out of bounds X", () => {
    expect(gameboard.placeShip(inputArray[0])).toBeFalsy();
  });

  test("Placing ship out of bounds Y", () => {
    expect(gameboard.placeShip(inputArray[1])).toBeFalsy();
  });

  test("Placing L shaped ship", () => {
    expect(gameboard.placeShip(inputArray[2])).toBeFalsy();
  });

  test("Placing ship on empty space X-axis", () => {
    expect(gameboard.placeShip(inputArray[3])).toBeTruthy();
  });

  test("Placing ship over another ship on X-axis", () => {
    expect(gameboard.placeShip(inputArray[4])).toBeFalsy();
  });

  test("Placing ship on empty space Y-axis", () => {
    expect(gameboard.placeShip(inputArray[5])).toBeTruthy();
  });

  test("Placing ship over another ship on Y-axis", () => {
    expect(gameboard.placeShip(inputArray[6])).toBeFalsy();
  });
});

describe("Receiving attacks", () => {
  let inputArray;
  beforeAll(() => {
    inputArray = [
      { x: -1, y: 0 }, // Out of bounds
      { x: BOARD_SIZE, y: 1 }, // Out of bounds
      { x: 1, y: 1 }, // Miss
      { x: 7, y: 0 }, // Hit
      { x: 1, y: 1 }, // Already fired
      { x: 7, y: 0 }, // Already fired
    ];
  });

  test("Firing out of bounds", () => {
    expect(gameboard.receiveAttack(inputArray[0])).toMatch("Out of bounds");
  });

  test("Firing out of bounds", () => {
    expect(gameboard.receiveAttack(inputArray[1])).toMatch("Out of bounds");
  });

  test("Firing at blank", () => {
    expect(gameboard.receiveAttack(inputArray[2])).toMatch("Miss");
  });

  test("Firing at ship", () => {
    expect(gameboard.receiveAttack(inputArray[3])).toMatch("Hit");
  });

  test("Firing at already hit blank", () => {
    expect(gameboard.receiveAttack(inputArray[4])).toMatch("Already fired");
  });

  test("Firing at already hit ship", () => {
    expect(gameboard.receiveAttack(inputArray[5])).toMatch("Already fired");
  });
});

describe("Checking if all ships are sunk", () => {
  describe("Sinking all ships", () => {
    let shipSpans;
    beforeAll(() => {
      shipSpans = [
        [
          { x: 3, y: 0 }, // position|
          { x: 4, y: 0 }, // position|
          { x: 5, y: 0 }, // position| => shipSpan
          { x: 6, y: 0 }, // position|
          { x: 7, y: 0 }, // position|
        ],
        [
          { x: 4, y: 2 },
          { x: 4, y: 3 },
          { x: 4, y: 4 },
          { x: 4, y: 5 },
        ],
      ];
    });

    test("Attacking first ship untill sunk", () => {
      const shipSpan = shipSpans[0];
      shipSpan.forEach((position) => gameboard.receiveAttack(position));
      expect(gameboard.isAllSunk()).toBeFalsy();
    });

    test("Attacking all ships untill sunk (including already sunked ones)", () => {
      shipSpans.forEach((shipSpan) =>
        shipSpan.forEach((position) => gameboard.receiveAttack(position))
      );
      expect(gameboard.isAllSunk()).toBeTruthy();
    });
  });

  test("Receiving attacks after all ships are sunk", () => {
    const positions = [
      { x: -2, y: BOARD_SIZE },
      { x: 1, y: 4 },
      { x: 3, y: 0 },
    ];
    positions.forEach((position) => gameboard.receiveAttack(position));
    expect(gameboard.isAllSunk()).toBeTruthy();
  });
});
