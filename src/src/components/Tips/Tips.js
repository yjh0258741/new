import React, {
  useState, useRef, useReducer, useEffect,
} from 'react';
import classNames from 'classnames';
import './Tips.less';
import { delay, noop, getErrorMsg } from '@src/lib/utillib';

const iconMap = {
  info: '//main.qcloudimg.com/raw/7d2d847983da08aebdbb61501d3bea53/icon-info.svg',
  danger: '//main.qcloudimg.com/raw/61c12548fb47b74064acecced7d5c59f/icon-danger-white.svg',
  loading: '//main.qcloudimg.com/raw/1b5be09b703b5e17f84428d52d11dd1e/icon-loading.svg',
  success: '//main.qcloudimg.com/raw/237e09660b3bac0bc51c3df426d76af9/icon-success.svg',
  // info: '/common/icon-info.svg',
  // danger: '/common/icon-danger-white.svg',
  // loading: '/common/icon-loading.svg',
  // success: '/common/icon-success.svg',
};

export default function Tips({
  getInner = noop,
}) {
  const canClickCloseRef = useRef(false);
  const tipsTimerRef = useRef(null);
  const timeoutTimerRef = useRef(null);
  const tipsPromiseRef = useRef(null);
  const promiseResolveRef = useRef(null);
  const canBeReplaceRef = useRef(false);
  const delayRejectRef = useRef(null);
  const [status, setStatus] = useState({
    message: '',
    type: 'info', // danger, success
    // hide: true,
    show: false,
    showMask: false,
    animationData: null,
  });
  const hideFnRef = useRef(null);

  const hide = async () => {
    if (delayRejectRef.current) {
      delayRejectRef.current();
    }
    clearTimeout(tipsTimerRef.current);
    clearTimeout(timeoutTimerRef.current);

    setStatus({
      ...status,
    });

    await delay(200);

    setStatus({
      ...status,
      // hide: true,
      show: false,
      showMask: false,
    });

    if (tipsPromiseRef.current && promiseResolveRef.current) {
      promiseResolveRef.current();
      tipsPromiseRef.current = null;
      promiseResolveRef.current = null;
    }
  };

  hideFnRef.current = () => {
    hide();
  };

  const show = async (message, {
    type = 'info',
    waitForHide = true,
    mask = false,
    duration = 1500,
    delayDuration = 0,
    canClickClose = true,
    canBeReplace = false, // 默认已经有弹出时，后面弹出的忽略，如果设置为true，则后面的可以覆盖前面的
    noTimeout = false,
  }) => {
    // 与原showModal保持一致，已弹出或appHiding不展示
    if (!canBeReplaceRef.current && (status.show)) return;
    // if (!canBeReplaceRef.current && (!status.hide)) return;

    canBeReplaceRef.current = canBeReplace;
    canClickCloseRef.current = canClickClose;

    // TODO: 观察有无副作用
    if (delayRejectRef.current) {
      delayRejectRef.current();
    }

    // 延时展示，避免一闪而过
    if (delayDuration) {
      try {
        await new Promise((resolve, reject) => {
          delayRejectRef.current = reject;

          setTimeout(() => {
            resolve();
          }, delayDuration);
        });
      } catch (err) {
        return Promise.resolve();
      }
    }

    if (!iconMap[type]) {
      type = 'info';
    }

    const nextState = {
      ...status,
      // hide: false,
      show: true,
      message,
      type,
      showMask: mask,
    };

    setStatus(nextState);

    if (duration) {
      tipsTimerRef.current = setTimeout(() => {
        hideFnRef.current();
      }, duration);
    }

    await delay(0);

    setStatus({
      ...nextState,
    });

    // 未设置duration时，无论如何都设置40秒超时，避免showLoading后因为各种奇怪原因没有hide掉
    if (!duration && !noTimeout) {
      timeoutTimerRef.current = setTimeout(() => {
        // TODO
      }, 40 * 1000);
    }

    if (waitForHide && duration) {
      tipsPromiseRef.current = new Promise((resolve) => {
        promiseResolveRef.current = resolve;
      });

      return tipsPromiseRef.current;
    }
  };

  const onClickTips = () => {
    if (canClickCloseRef.current) {
      hide();
    }
  };

  /**
   * 新增的轻量提示，行为尽量和原notice模块一致
   */
  const showError = async (err /* or message */, {
    defaultMsg, mask = true, duration = 3000, ...opts
  } = {}) => {
    const errMsg = getErrorMsg(err, { defaultMsg, ...opts });

    if (errMsg) {
      return show(errMsg, {
        type: 'danger', mask, duration, ...opts,
      });
    }
  };

  const showTips = (message, type = 'info', { duration = 3000, ...opts } = {}) => show(message, { type, duration, ...opts });

  const showInfo = (message, opts = {}) => show(message, { type: 'info', ...opts });

  const showSuccess = (message, { mask = true, ...opts } = {}) => show(message, { type: 'success', mask, ...opts });

  const showLoading = (message = '加载中…', { mask = true, noTimeout = false, ...opts } = {}) => {
    if (!message.endsWith('…')) {
      message += '…';
    }

    return show(message, {
      mask,
      type: 'loading',
      canBeReplace: true,
      duration: 0,
      delayDuration: 200,
      canClickClose: false,
      noTimeout,
      ...opts,
    });
  };

  const hideLoading = () => hide();

  getInner({
    show,
    hide,
    showError,
    showTips,
    showInfo,
    showSuccess,
    showLoading,
    hideLoading,
  });

  return (
    <>
      {status.showMask && (
        <div
          className="float-mask"
        />
      )}
      <div
        role="button"
        className={classNames('float-tips', `tips-${status.type}`, {
          // hide: status.hide,
          show: status.show,
        })}
        onClick={onClickTips}
      >
        <img
          className={classNames('tips-icon', `icon-${status.type}`)}
          src={iconMap[status.type]}
          alt=""
        />
        <span className="tips-message">{status.message}</span>
      </div>
    </>
  );
}
