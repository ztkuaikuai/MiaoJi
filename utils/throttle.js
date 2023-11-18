/**
 * 节流函数，确保函数在一定时间间隔内最多被调用一次。
 * @param {Function} func - 要被节流的函数。
 * @param {number} delay - 以毫秒为单位的时间间隔。
 * @returns {Function} - 经过节流处理的函数。
 */
export function throttle(func, delay) {
  let lastTime = 0;

  return function (...args) {
    const now = new Date().getTime();

    if (now - lastTime >= delay) {
      func.apply(this, args);
      lastTime = now;
    }
  };
}