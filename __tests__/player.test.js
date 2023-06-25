import Player from "../src/player";

const BOARD_SIZE = 10;
const NUMBER_OF_PLAYERS = 2;
const NUMBER_OF_ITERATIONS = 2;
const GAME_END_MSG = "Game over";
const DENY_MSG = "Not your turn";
const player1 = Player(true);
const player2 = Player(false);

for (let i = 1; i <= NUMBER_OF_ITERATIONS; i += 1) {
  for (let j = 1; j <= NUMBER_OF_PLAYERS; j += 1) {
    let prefix = "";
    if (i === 1 && j === 1) prefix = "Initialising players\n  ";
    else if (j === 1) prefix = "Resetting players\n  ";

    describe(`${prefix}Placing ships for player${j}, round ${i}`, () => {
      let player;
      let inputArray;
      beforeAll(() => {
        switch (j) {
          case 1:
            player = player1;
            if (i === 1) {
              player1.setOpponent(player2);
              player2.setOpponent(player1);
            } else {
              player1.reset();
              player2.reset();
            }
            break;
          default:
            player = player2;
            break;
        }
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
        expect(player.placeShip(inputArray[0])).toBeFalsy();
      });

      test("Placing ship out of bounds Y", () => {
        expect(player.placeShip(inputArray[1])).toBeFalsy();
      });

      test("Placing L shaped ship", () => {
        expect(player.placeShip(inputArray[2])).toBeFalsy();
      });

      test("Placing ship on empty space X-axis", () => {
        expect(player.placeShip(inputArray[3])).toBeTruthy();
      });

      test("Placing ship over another ship on X-axis", () => {
        expect(player.placeShip(inputArray[4])).toBeFalsy();
      });

      test("Placing ship on empty space Y-axis", () => {
        expect(player.placeShip(inputArray[5])).toBeTruthy();
      });

      test("Placing ship over another ship on Y-axis", () => {
        expect(player.placeShip(inputArray[6])).toBeFalsy();
      });
    });
  }

  describe(`Firing attacks round ${i}`, () => {
    let inputArray;
    beforeAll(() => {
      inputArray = [
        { x: -1, y: 0 }, // Out of bounds
        { x: BOARD_SIZE, y: 1 }, // Out of bounds
        { x: 1, y: 1 }, // Miss
        { x: 7, y: 0 }, // Hit
        { x: 1, y: 1 }, // Already fired
        { x: 7, y: 0 }, // Already fired
        { x: 9, y: 9 }, // Miss
      ];
    });
    test("Firing out of bounds", () => {
      expect(player1.fire(inputArray[0])).toMatch("Out of bounds");
    });

    test("Firing out of bounds", () => {
      expect(player1.fire(inputArray[1])).toMatch("Out of bounds");
    });

    test("Firing at blank", () => {
      expect(player1.fire(inputArray[2])).toMatch("Miss");
    });

    test("Firing at ship", () => {
      expect(player2.fire(inputArray[3])).toMatch("Hit");
    });

    test("Firing at already hit blank", () => {
      expect(player1.fire(inputArray[4])).toMatch("Already fired");
    });

    test("Firing during opponent's turn", () => {
      expect(player2.fire(inputArray[5])).toMatch(DENY_MSG);
    });

    test("Firing at ship", () => {
      expect(player1.fire(inputArray[3])).toMatch("Hit");
    });

    test("Firing at blank", () => {
      expect(player2.fire(inputArray[6])).toMatch("Miss");
    });
  });

  describe(`Firing attacks untill gameover round ${i}`, () => {
    let shipSpans;
    let lastMove;
    beforeAll(() => {
      shipSpans = [
        [
          { x: 3, y: 0 }, // position|
          { x: 4, y: 0 }, // position|
          { x: 5, y: 0 }, // position| => shipSpan
          { x: 6, y: 0 }, // position|
        ],
        [
          { x: 4, y: 2 },
          { x: 4, y: 3 },
          { x: 4, y: 4 },
        ],
      ];
      lastMove = { x: 4, y: 5 };
    });

    test("Firing untill 1HP remaining", () => {
      shipSpans.forEach((shipSpan) =>
        shipSpan.forEach((position) => {
          expect(player1.fire(position)).toMatch("Hit");
          expect(player2.fire(position)).toMatch("Hit");
        })
      );
      expect(player1.fire(lastMove)).toMatch(GAME_END_MSG);
    });
  });

  describe(`Firing attacks past gameover round ${i}`, () => {
    const positions = [
      { x: -2, y: BOARD_SIZE },
      { x: 1, y: 4 },
      { x: 3, y: 0 },
    ];
    positions.forEach((position) =>
      test("Receiving attack", () => {
        expect(player1.fire(position)).toMatch(DENY_MSG);
        expect(player2.fire(position)).toMatch(DENY_MSG);
      })
    );
  });
}
