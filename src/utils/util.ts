import dayjs from "dayjs";

const formatTime = (date: string | number | Date | dayjs.Dayjs, template: string) =>
  dayjs(date).format(template);

/**
 * 格式化价格数额为字符串
 * 可对小数部分进行填充，默认不填充
 * @param price 价格数额，以分为单位!
 * @param fill 是否填充小数部分 0-不填充 1-填充第一位小数 2-填充两位小数
 */
function priceFormat(price: number, fill = 0) {
  if (Number.isNaN(price) || price === null || price === Number.POSITIVE_INFINITY) {
    return price;
  }

  const priceValue = Math.round(Number.parseFloat(`${price}`) * 10 ** 8) / 10 ** 8; // 恢复精度丢失
  let priceValueStr = `${Math.ceil(priceValue) / 100}`; // 向上取整，单位转换为元，转换为字符串
  if (fill > 0) {
    // 补充小数位数
    if (priceValueStr.indexOf(".") === -1) {
      priceValueStr = `${priceValueStr}.`;
    }
    const n = fill - priceValueStr.split(".")[1]?.length;
    for (let i = 0; i < n; i++) {
      priceValueStr = `${priceValueStr}0`;
    }
  }
  return priceValueStr;
}

/**
 * 获取cdn裁剪后链接
 *
 * @param {string} url 基础链接
 * @param {number} width 宽度，单位px
 * @param {number} [height] 可选，高度，不填时与width同值
 */
const cosThumb = (url: string, width: number, height = width) => {
  if (url.indexOf("?") > -1) {
    return url;
  }

  let newUrl = url;
  if (url.indexOf("http://") === 0) {
    newUrl = newUrl.replace("http://", "https://");
  }

  return `${newUrl}?imageMogr2/thumbnail/${~~width}x${~~height}`;
};

const get = <T = unknown>(
  source: Record<string, unknown> | null | undefined,
  paths: string | string[],
  defaultValue: T
): T | unknown => {
  // 处理源对象为null或undefined的情况
  if (source === null || source === undefined) {
    return defaultValue;
  }

  // 处理路径：支持字符串和数组两种形式
  const newPaths: string[] = Array.isArray(paths)
    ? paths.filter(Boolean) // 过滤空字符串路径
    : paths.replace(/\[/g, ".").replace(/\]/g, "").split(".").filter(Boolean);

  // 空路径直接返回源对象
  if (newPaths.length === 0) {
    return source;
  }

  let index = 0;
  let current: unknown = source;

  // 遍历路径获取值，添加类型守卫检查
  while (index < newPaths.length) {
    // 检查当前值是否为对象且不为null
    if (current !== null && typeof current === "object") {
      current = (current as Record<string, unknown>)[newPaths[index]];
      index++;
    } else {
      // 如果当前值不是对象，无法继续获取属性，跳出循环
      current = undefined;
      break;
    }
  }

  // 检查是否遍历完所有路径，未完成则返回默认值
  return index === newPaths.length && current !== undefined ? current : defaultValue;
};

export const loadSystemWidth = (): number => {
  try {
    // 检查wx对象是否存在
    if (typeof wx === "undefined") {
      throw new Error("wx is not defined");
    }

    // 检查getWindowInfo方法是否存在
    if (typeof wx.getWindowInfo !== "function") {
      throw new Error("wx.getWindowInfo is not a function");
    }

    const { screenWidth } = wx.getWindowInfo();

    // 验证返回的宽度是否为有效的数值
    if (typeof screenWidth !== "number" || screenWidth <= 0) {
      throw new Error(`Invalid screenWidth: ${screenWidth}`);
    }

    return screenWidth;
  } catch (e: unknown) {
    // 可以根据需要添加错误日志
    console.warn("Failed to load system width:", e);
    return 0;
  }
};

/**
 * 转换rpx为px
 *
 * @description
 * 什么时候用？
 * - 布局(width: 172rpx)已经写好, 某些组件只接受px作为style或者prop指定
 *
 */
const rpx2px = (rpx: number, round = false) => {
  loadSystemWidth();

  // px / systemWidth = rpx / 750
  const result = (rpx * loadSystemWidth()) / 750;

  if (round) {
    return Math.floor(result);
  }

  return result;
};

const phonePat = /(\d{3})\d{4}(\d{4})/;
/**
 * 手机号码*加密函数
 * @param {string} phone 电话号
 * @returns
 */

const phoneEncryption = (phone: string) => {
  return phone.replace(phonePat, "$1****$2");
};

// 内置手机号正则字符串
const innerPhoneReg = "^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$";

/**
 * 手机号正则校验
 * @param phone 手机号
 * @param phoneReg 正则字符串
 * @returns true - 校验通过 false - 校验失败
 */
const phoneRegCheck = (phone: string) => {
  const phoneRegExp = new RegExp(innerPhoneReg);
  return phoneRegExp.test(phone);
};

module.exports = {
  formatTime,
  priceFormat,
  cosThumb,
  get,
  rpx2px,
  phoneEncryption,
  phoneRegCheck,
};
