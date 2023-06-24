const Ship = (length) => {
  let sunkFlag = false;
  let hits = 0;

  const incrementHits = () => {
    hits += 1;
    return hits >= length;
  }

  const hit = () => {
    sunkFlag = sunkFlag || incrementHits();
  }

  const isSunk = () => sunkFlag;

  return {
    hit,
    isSunk,
  };
};

export default Ship;
