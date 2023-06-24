const ship = (length) => {
  let sunkFlag = false;
  let hits = 0;

  function incrementHits() {
    hits += 1;
    return hits >= length;
  }

  function hit() {
    sunkFlag = sunkFlag || incrementHits();
  }

  function isSunk() {
    return sunkFlag;
  }

  return {
    hit,
    isSunk,
  }
};

export default ship;
