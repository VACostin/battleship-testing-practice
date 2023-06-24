import Ship from "../src/ship";

const length = 5;
const shipObj = Ship(length);

describe("Initial ship state", () => {
  test("Ship not sunk at start", () => {
    expect(shipObj.isSunk()).toBeFalsy();
  });
});

describe("Hitting ship untill it sinks and beyond", () => {
  test("Hitting once - Ship not sunk yet", () => {
    shipObj.hit();
    expect(shipObj.isSunk()).toBeFalsy();
  });
  test("Hitting until 1HP - Ship not sunk yet", () => {
    for (let i = 0; i < length - 2; i += 1) shipObj.hit();
    expect(shipObj.isSunk()).toBeFalsy();
  });
  test("Last hit - Ship is sunk", () => {
    shipObj.hit();
    expect(shipObj.isSunk()).toBeTruthy();
  });
  test("Extra hits won't bring back the ship, you know?", () => {
    shipObj.hit();
    expect(shipObj.isSunk()).toBeTruthy();
  });
});
