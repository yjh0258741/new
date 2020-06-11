import dateformat from 'dateformat';
import urlParse from 'url-parse';
import querystring from 'query-string';
// import commonBridge from './common-bridge';
const _ = require('lodash');

export const delay = timeout => new Promise(resolve => setTimeout(() => resolve(), timeout));

export const genReqId = () => `${Date.now().toString()}-${Math.floor(Math.random() * 10000)}`;

export const getStrLen = (str) => {
  if (!str) str = '';

  let len = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i); // 单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
};

export const isSafeInteger = number => +number <= Math.pow(2, 53) - 1;

export const isNumber = value => /^[0-9]*$/.test(value);

export const appendParams = (url, data) => {
  const paramArr = [];
  _.forEach(data, (value, key) => {
    if (typeof value !== 'undefined') {
      if (_.isObject(value)) {
        value = JSON.stringify(value);
      }
      paramArr.push(`${key}=${encodeURIComponent(value)}`);
    }
  });

  if (!paramArr.length) return url;

  return (url.indexOf('?') > -1 ? `${url}&` : `${url}?`) + paramArr.join('&');
};

export const parseParams = (params = {}) => {
  const result = {};

  _.forEach(params, (value, key) => {
    if (typeof value === 'string') {
      try {
        value = decodeURIComponent(value);
      } catch (e) {}
    }
    try {
      const _value = JSON.parse(value);
      if (typeof _value === 'number') {
        if (isSafeInteger(_value)) {
          value = _value;
        }
      } else {
        value = _value;
      }
    } catch (err) {}
    result[key] = value;
  });

  return result;
};

export const rpx2px = (rpx) => {
  // const { windowWidth } = wxlib.system.info;
  // return (rpx / 2) * (windowWidth / 375);
};

export const normalizeBool = value => !(value === 0 || value === false);

export const hashString = (str) => {
  let hash = 0;
  let i;
  let chr;
  let len;

  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }

  return hash;
};

export const getValueFromRange = (range) => {
  const value = [];
  range.forEach((item, index) => {
    if (item.active) {
      value.push(index);
    }
  });
  return value;
};

/**
 * 验证身份证号码是否正确
 * @param {*} cardNumber
 * @returns
 */
export const isValidMainlandIDCardNumber = (cardNumber) => {
  // 基本格式校验，18 位，最后一位可以为 X
  if (!/^\d{17}[\dxX]$/.test(cardNumber)) {
    return false;
  }

  // 校验码校验
  const wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const ai = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  let sigma = 0;
  for (let i = 0; i < wi.length; i++) {
    sigma += wi[i] * (+cardNumber[i]);
  }
  const n = sigma % 11;
  return cardNumber.substr(-1) === ai[n];
};

/**
 * 检测是否是邮箱
 * @param mail
 * @return {Boolean} 是否是正确邮箱格式
 * @author lockewu
 */
export const isMail = mail => /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(String(mail).trim());

export const validateForm = (formConfig, formData = null) => {
  if (!formData) {
    formData = {};

    formConfig.forEach((item) => {
      if (item.enable) {
        if (item.type === 'selector' && item.multi) {
          formData[item.name] = getValueFromRange(item.range);
        } else {
          formData[item.name] = item.value;
        }
      }
    });
  }

  for (let fieldIndex = 0, l = formConfig.length; fieldIndex < l; fieldIndex++) {
    const row = formConfig[fieldIndex];

    if (row.enable && row.rules && row.rules.length) {
      const value = formData[row.name];

      for (let ruleIndex = 0, ruleLength = row.rules.length; ruleIndex < ruleLength; ruleIndex++) {
        const {
          validate,
          message,
          reg,
          regOpts,
          required,
          sameAs,
          checkType,
          namespace,
        } = row.rules[ruleIndex];

        let errorMsg = '';

        if (!validate && !reg && !required && !checkType && !namespace) {
          console.warn('无有效的校验规则，请检查配置');
        }

        if (validate) {
          if (_.isFunction(validate)) {
            if (!validate(value)) {
              if (_.isFunction(message)) {
                errorMsg = message(value);
              } else {
                errorMsg = message;
              }
            }
          } else if (_.isRegExp(validate)) {
            if (!validate.test(value)) {
              errorMsg = message;
            }
          }
        } else if (reg) {
          if (new RegExp(reg, regOpts).test(value)) {
            errorMsg = message;
          }
        } else if (required) {
          let isValid = true;
          switch (row.type) {
            case 'picker':
              if (row.mode === 'multiSelector') {
                isValid = value && value.length && value.every(index => index > -1);
              } else {
                isValid = value > -1;
              }
              break;
            case 'selector':
              if (row.multi) {
                isValid = row.range.some(item => item.active);
              } else {
                isValid = value > -1;
              }
              break;
            default:
              if (!String(value).trim().length) {
                isValid = false;
              }
              break;
          }

          if (!isValid) {
            errorMsg = message;
          }
        } else if (sameAs) {
          if (formData[sameAs] !== value) {
            errorMsg = message;
          }
        } else if (checkType) {
          switch (checkType) {
            case 'mail':
              if (!isMail(value)) {
                errorMsg = message;
              }
              break;
            case 'idcard':
              if (!isValidMainlandIDCardNumber(value)) {
                errorMsg = message;
              }
              break;
          }
        } else if (namespace) {
          // const msg = commonBridge.get(namespace)(value);
          // if (msg) {
          //   errorMsg = msg;
          // }
        }

        if (errorMsg) {
          throw {
            msg: errorMsg,
            ruleIndex,
            fieldIndex,
          };
        }
      }
    }
  }
};

export const operatingReject = (error) => {
  if (error && error.errMsg && /cancel/.test(error.errMsg)) {
    return Promise.reject();
  }
  return Promise.reject(error);
};

/**
 * 获取标准化的Date实例
 *
 * 时间字符串有两个标准:
 * ISO 8601标准: YYYY-MM-DDThh:mm:ss
 * RFC2822标准: YYYY/MM/DD HH:MM:SS ± timezon(时区用4位数字表示)
 *
 * IOS new Date支持标准的ISO 8601与RFC2822时间字符串，但是如: 2017-08-25 19:13:00这种字符串直接new Date会返回null
 *
 * @param dateStr
 */
export function getStandardDate(dateStr) {
  let date = new Date(dateStr);

  // 先尝试直接new，如果不合法再继续走
  if (!isNaN(date)) {
    return date;
  }

  try {
    let arr = dateStr.split(/[-+ :T.]/);
    arr = arr.map(row => row.replace(/\D/g, ''));

    date = new Date();

    date.setFullYear(arr[0]);
    date.setMonth(arr[1] - 1);
    date.setDate(arr[2]);
    date.setHours(arr[3] || 0);
    date.setMinutes(arr[4] || 0);
    date.setSeconds(arr[5] || 0);
    date.setMilliseconds(arr[6] || 0);

    return date;
  } catch (err) {
    console.error(err);
    return new Date(dateStr);
  }
}

// 返回一个可以遍历的指定长度的数组:  array(5).map((v, index) => console.log(index));
export function array(length) {
  return Array(...new Array(length));
}

/**
 * 格式化时间
 *
 * dd - 天
 * mm - 月
 * yyyy - 年
 * hh - 小时
 * MM - 分钟
 * ss - 秒
 *
 * @see https://www.npmjs.com/package/dateformat
 * @param {*} [date]
 * @param [pattern]
 * @return {String}
 */
export function formatDate(date, pattern = 'yyyy-mm-dd HH:MM:ss') {
  if (!(date instanceof Date)) {
    if (typeof date === 'string') {
      date = getStandardDate(date);
    } else if (_.isNumber(date)) {
      date = new Date(date);
    } else {
      date = new Date();
    }
  }

  try {
    return date ? dateformat(date, pattern) : '-';
  } catch (err) {
    return '-';
  }
}

export const noop = () => {
};

export function defineMap2SelectorList(defineMap) {
  const result = [];

  for (const key in defineMap) {
    result.push({ value: key, text: defineMap[key] });
  }

  return result;
}

/**
 * 获取精度
 */
export function getPrecision(value) {
  if (typeof value !== 'number') {
    return 0;
  }
  const str = value.toString();
  if (/e-(.+)$/.test(str)) {
    return parseInt(RegExp.$1, 10);
  }
  if (str.indexOf('.') >= 0) {
    return str.length - str.indexOf('.') - 1;
  }
  return 0;
}

export async function fetchAllList(fetchFn) {
  const limit = 100;
  let offset = 0;
  let total = 100;
  let list = [];

  while (offset === 0 || list.length < total) {
    const resp = await fetchFn({ offset, limit });

    if (!resp.list.length) return list;

    total = resp.total;
    offset = offset + limit;
    list = list.concat(resp.list);
  }

  return list;
}


export function isNumeric(any) {
  return !_.isNaN(parseFloat(any)) && _.isFinite(any);
}

export function validateFormField({
  formData,
  name,
  value,
  fieldConfig,
}) {
  if (!fieldConfig.rules) return '';

  const defaultMsg = fieldConfig.message;

  for (let i = 0, l = fieldConfig.rules.length; i < l; i++) {
    const {
      validate,
      message,
      reg,
      regStr,
      regOpts,
      required,
      sameAs,
    } = fieldConfig.rules[i];

    let errorMsg = '';
    let hasError = false;

    if (validate) {
      if (_.isFunction(validate)) {
        if (!validate(value, formData)) {
          if (_.isFunction(message)) {
            errorMsg = message(value);
          } else {
            errorMsg = message;
          }

          hasError = true;
        }
      }
    } else if (reg) {
      if (!reg.test(value)) {
        errorMsg = message;
        hasError = true;
      }
    } else if (regStr) {
      if (!new RegExp(regStr, regOpts).test(value)) {
        errorMsg = message;
        hasError = true;
      }
    } else if (required) {
      let isValid = true;
      switch (fieldConfig.type) {
        case 'selector':
          if (typeof value !== 'undefined' && fieldConfig.options) {
            isValid = !!fieldConfig.options.find(item => item.value === value);
          } else {
            isValid = false;
          }
          break;
        default: {
          // 只要是个数，就可以认为有值了，更精确的规则请使用其他规则
          if (!isNumeric(value) && !String(value || '').trim().length) {
            isValid = false;
          }
          break;
        }
      }

      if (!isValid) {
        errorMsg = message;
        hasError = true;
      }
    } else if (sameAs) {
      if (formData[sameAs] !== value) {
        errorMsg = message;
        hasError = true;
      }
    }

    if (hasError) {
      return errorMsg || defaultMsg;
    }
  }
}

/**
 * 倒计时
 * @param finishTime 结束的时间戳
 * @param intervalCallback 倒计时中每个时刻执行的回调，传入剩余时间(ms)
 * @param finishCallback 倒计时结束的回调
 * @return {{stop: (function())}} 返回一个对象，保护一个stop方法，调用则停止倒计时
 */
export const countDown = (finishTime, intervalCallback, finishCallback = noop) => {
  let timer;

  if (isNumeric(finishTime)) {
    intervalCallback(finishTime - Date.now());

    timer = setInterval(() => {
      const timeLeft = finishTime - Date.now();

      if (timeLeft > 0) {
        intervalCallback(timeLeft);
      } else {
        clearInterval(timer);
        if (_.isFunction(finishCallback)) {
          finishCallback();
        }
      }
    }, 500);
  } else if (_.isFunction(finishCallback)) {
    finishCallback();
  }

  return {
    stop: () => clearInterval(timer),
  };
};

/**
 * 掩盖手机,使部分可见：手机头尾至少显示两位，中间最多隐藏4位
 * 如：15012346685 => 150****6685
 * @param  {String} phoneNumber
 * @return {String} phoneNumber 若未处理，则原样返回
 * @author  ericji
 */
export function maskPhoneNumber(phoneNumber) {
  phoneNumber = `${phoneNumber}`;

  if (/^\d{5,}$/.test(phoneNumber)) {
    const left = phoneNumber.slice(0, 2);
    let middle = phoneNumber.slice(2, -2);
    const right = phoneNumber.slice(-2);

    if (middle.length <= 4) {
      middle = '****'.slice(0, middle.length);
    } else {
      middle = `${middle.slice(0, Math.floor(middle.length / 2) - 2)}****${middle.slice(Math.floor(middle.length / 2) + 2)}`;
    }

    phoneNumber = left + middle + right;
  }

  return phoneNumber;
}

/**
 * 掩盖邮箱,使部分可见：隐藏`@`前4位,`@`前少于5位则用`*`号补全5位
 * 如：12345678@qq.com => 1234****@qq.com; 1234@qq.com => 1****@qq.com
 * @param  {String} mail
 * @return {String} mail 若未处理，则原样返回
 * @author  ericji
 */
export function maskMail(mail) {
  // 已经处理过了不再处理
  if (mail.indexOf('*') !== -1) {
    return mail;
  }

  const mailPair = mail.split('@');

  if (mailPair.length !== 2) {
    return mail;
  }

  let mailId = mailPair[0];
  const mailDomain = mailPair[1];

  if (mailId.length > 4) {
    mailId = `${mailId.slice(0, -4)}****`;
  } else {
    mailId = `${mailId.slice(0, 1)}****`;
  }

  return (`${mailId}@${mailDomain}`);
}

export function parseUrl(url) {
  const uri = urlParse(url);

  if (uri && uri.query) {
    uri.query = querystring.parse(uri.query);
  }

  return uri;
}

export function getArrayProps(array, key) {
  var key = key || "value";
  var res = [];
  if (array) {
    array.forEach(function (t) {
      res.push(t[key]);
    });
  }
  return res;
}

/**
 * 获取错误信息
 * @param {Object|String} err
 * @param defaultMsg
 * @param errMsgKey 默认从哪个key中取错误信息，默认为 'msg'
 * @return {*}
 */
const codeReg = /\((\d+)\).+/;
export const getErrorMsg = (err, {
  defaultMsg = '',
  errMsgKey = 'msg',
} = {}) => {
  console.log(err, err.stack);

  const errorMsg = (() => {
    if (!err) return;
    let message = '';

    if (typeof err === 'string') return err;

    if (_.isPlainObject(err)) {
      message = err[errMsgKey] || err.Message || err.msg || err.message || err.errMsg || '连接服务器失败，请稍后再试';

      if (err.reqId) {
        message += `(${err.reqId})`;
      } else if (err.code && !codeReg.test(message)) {
        message += `(${err.code})`;
      }
    }

    if (!message) {
      message = defaultMsg || '连接服务器失败，请稍后再试';
    }

    return message;
  })();

  return errorMsg;
}
