import ship from "../src/ship";

const length = 5;
const shipObj = ship(length);

describe("Initial ship state", () => {
  test("Ship not sunk at start", () => {
    expect(shipObj.isSunk()).toBeFalsy();
  });
});

describe("Hitting ship untill it sinks and beyond", () => {
  test("Ship not sunk yet", () => {
    shipObj.hit();
    expect(shipObj.isSunk()).toBeFalsy();
  });
  test("Ship not sunk yet", () => {
    shipObj.hit();
    shipObj.hit();
    shipObj.hit();
    expect(shipObj.isSunk()).toBeFalsy();
  });
  test("Ship is sunk", () => {
    shipObj.hit();
    expect(shipObj.isSunk()).toBeTruthy();
  });
  test("Ship extra hits won't bring back the ship, you know?", () => {
    shipObj.hit();
    expect(shipObj.isSunk()).toBeTruthy();
  });
});
