import React, { useRef, useState } from 'react';

export const useGlobalComponents = () => {
  const [componentsReady, setComponentsReady] = useState(false);
  const components = useRef({
    loadingBar: null,
    tips: null,
  });

  const checkComponentReady = () => {
    if (components.current.loadingBar && components.current.tips && !componentsReady) {
      setComponentsReady(true);
    }
  };

  const getLoadingBar = (fns) => {
    components.current.loadingBar = fns;
    checkComponentReady();
  };

  const getTips = (fns) => {
    components.current.tips = fns;
    checkComponentReady();
  };

  // TODO: 观察这样返回 ref 是否有不渲染问题？
  return [components.current, {
    getLoadingBar,
    getTips,
  }];
};
