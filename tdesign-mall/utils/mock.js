/**
 * 随机打散字符串
 * @param {number} n 长度
 * @param {string} str 字符串
 * @returns
 */
function generateMixed(n, str) {
  let res = "";
  for (let i = 0; i < n; i++) {
    const id = Math.ceil(Math.random() * 35);
    res += str[id];
  }
  return res;
}

/**
 * 生成随机数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns
 */
function getRandomNum(min, max) {
  const range = max - min;
  const rand = Math.random();
  return min + Math.round(rand * range);
}

/**
 * 生成随机IP
 * @returns
 */
function mockIp() {
  return `10.${getRandomNum(1, 254)}.${getRandomNum(1, 254)}.${getRandomNum(1, 254)}`;
}

function mockReqId() {
  return `${getRandomNum(100_000, 999_999)}.${Date.now()}${getRandomNum(
    1000,
    9999
  )}.${getRandomNum(10_000_000, 99_999_999)}`;
}

module.exports = {
  generateMixed,
  mockIp,
  mockReqId,
  getRandomNum,
};
