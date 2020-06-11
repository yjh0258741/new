import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import './LoadingBar.less';
import { delay, noop } from '@src/lib/utillib';

export default function LoadingBar({
  enable = true,
  getInner = noop,
  autoStart = false,
}) {
  const loadingBarTimerRef = useRef(null);
  const loadingBarTimeoutRef = useRef(null);
  const [percent, setPercent] = useState(0);
  const [complete, setComplete] = useState(false);
  const getNextPercentRef = useRef(null);

  getNextPercentRef.current = () => {
    return LoadingBar.getNextPercent(percent);
  };

  const start = () => {
    if (!complete) {
      clearInterval(loadingBarTimerRef.current);
      loadingBarTimerRef.current = setInterval(() => {
        const nextPercent = getNextPercentRef.current();
        set(nextPercent);
      }, 250);

      clearTimeout(loadingBarTimeoutRef.current);
      // 20秒timeout
      loadingBarTimeoutRef.current = setTimeout(() => {
        clearInterval(loadingBarTimerRef.current);
        completeLoading(true);
      }, 200 * 1000);
    }
  };

  const set = async (percent) => {
    if (typeof percent === 'undefined') {
      return;
    }

    if (percent >= 100) {
      clearInterval(loadingBarTimerRef.current);
      clearTimeout(loadingBarTimeoutRef.current);
    }

    setPercent(percent);
    if (percent >= 100) {
      await delay(250); // 等待动画
      setComplete(true);
      await delay(250); // 等待动画
    }
  };

  const completeLoading = async (autoReset = false) => {
    if (!complete) {
      await set(100);
    }

    if (autoReset) {
      reset();
    }
  };

  const reset = async () => {
    clearInterval(loadingBarTimerRef.current);
    setPercent(0);
    await delay(250); // 等待动画
    setComplete(false);
  };

  getInner({
    start,
    set,
    complete: completeLoading,
    reset,
  });

  useEffect(() => {
    if (autoStart) {
      start();
    }
  }, [autoStart]);

  return enable ? (
    <div
      className={classNames('loading-bar', {
        'load-complete': complete,
      })}
    >
      <div
        className="bar"
        style={{
          width: `${percent || 0}%`,
        }}
      >
        <div className="peg"/>
      </div>
    </div>
  ) : <></>;
}

LoadingBar.options = {
  addGlobalClass: true,
};

LoadingBar.getNextPercent = (percent) => {
  if (percent >= 100) {
    return;
  }

  percent /= 100;

  let rnd = 0;

  if (percent >= 0 && percent < 0.25) {
    // Start out between 3 - 6% increments
    rnd = (Math.random() * (5 - 3 + 1) + 3) / 100;
  } else if (percent >= 0.25 && percent < 0.65) {
    // increment between 0 - 3%
    rnd = (Math.random() * 3) / 100;
  } else if (percent >= 0.65 && percent < 0.9) {
    // increment between 0 - 2%
    rnd = (Math.random() * 2) / 100;
  } else if (percent >= 0.9 && percent < 0.99) {
    // finally, increment it .5 %
    rnd = 0.005;
  } else {
    // after 99%, don't increment:
    rnd = 0;
  }

  return (percent + rnd) * 100;
};
