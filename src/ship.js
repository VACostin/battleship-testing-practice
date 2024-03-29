/**
 * @param {number} length 
 */

const Ship = (length) => {
  let sunkFlag = false;
  let hits = 0;

  const incrementHits = () => {
    hits += 1;
    return hits >= length;
  };

  /**
   * Updates {@link sunkFlag}
   */

  const hit = () => {
    sunkFlag = sunkFlag || incrementHits();
  };
  /**
   * Returns {@link sunkFlag}
   * 
   * @returns {boolean}
   */
  const isSunk = () => sunkFlag;

  return {
    hit,
    isSunk,
  };
};

export default Ship;
