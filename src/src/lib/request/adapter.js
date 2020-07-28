import querystring from 'query-string';
import shortid from '../shortid';
// import { store } from '../../redux/store';
// import * as types from '../../redux/ActionTypes';
import { delay } from '../utillib';
import { request } from './request';
import { getQueryUin } from './utils';

export const callYunApi = async (Action, { AccessToken, ...payload } = {}, {
  isTokenApi = false,
  isSecureApi = false,
  doNotReport = false,
  ...opts
} = {}) => {
  let reqOptions;
  const startTime = Date.now();
  const reqId = shortid();

  try {
    // const { login } = store.getState();

    // 支持手动传 token，此时优先使用传入的 token
    // if (!AccessToken && login.isLogin) {
    //   AccessToken = login.accessToken;
    // }

    const query = {
      uin: 'explorerOAuth',
    };

    // 添加公共参数
    payload = {
      ...payload,
      Action,
      Platform: 'weapp',
      RequestId: reqId,
      // AccessToken,
    };

    let url = 'https://iot.cloud.tencent.com/api/studioapp/';

    if (isSecureApi) {
      url += 'appsecureapi';
      query.cmd = Action;
      // const { code } = await Taro.login();
      // payload.JsCode = code;
    } else if (isTokenApi) {
      url += 'tokenapi';
      query.cmd = Action;
    } else {
      url += Action;
    }

    url += `?${querystring.stringify(query)}`;

    reqOptions = {
      url,
      data: payload,
      method: 'POST',
      ...opts,
    };

    const resp = await request(reqOptions);

    const { code, msg, data = {} } = resp;

    // if (Action !== 'AppDeviceTraceHeartBeat') {
    //   reportCgiData(reqOptions, resp, {
    //     timeCost: Date.now() - startTime,
    //     action: Action,
    //     doNotReport,
    //   });
    // }

    console.log('request ==> url: ', {
      url,
      data: payload,
      method: 'POST',
      ...opts,
    }, {
      code, msg, data,
    });

    if (code) {
      if (data) {
        if (data.Error) {
          // if ((data.Error.Code || '').indexOf('InvalidAccessToken') > -1) {
          //   store.dispatch({ type: types.LOG_OUT });

          //   await delay(0);

          //   throw { code: 'userNeedLogin', msg: '登录态已失效，请重新登录' };
          // }

          throw { code: data.Error.Code, msg: data.Error.Message, reqId: data.RequestId };
        }

        throw { code, msg, reqId: data.RequestId };
      }

      throw { code, msg };
    }

    return data;
  } catch (error) {
    // const networkType = await wxapi.getNetworkType();
    // const networkType = 'none';

    /* eslint no-shadow:0 */
    // if (networkType === 'none') {
    //   return Promise.reject({
    //     msg: '网络已断开，请检查网络再重试',
    //     code: 'NO_NETWORK',
    //   });
    // }

    return Promise.reject(error);
  }
};

export const reportInsight = (data) => request({
  url: 'https://iot.cloud.tencent.com/insight/event',
  data,
  method: 'POST',
});
