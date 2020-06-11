import React, { useEffect } from 'react';
import { parseParams, parseUrl } from '@src/lib/utillib';
import { useRouter } from 'next/router';

export const useParams = () => {
  const { query, pathname } = useRouter();

  const result = parseParams(query);

  // 自动解析 q 参数
  if (result.q) {
    const uri = parseUrl(result.q);

    if (uri && uri.query) {
      Object.assign(result, uri.query);
    }
  }

  useEffect(() => {
    console.log(`${pathname} on Load with params`, query);
  }, [query]);

  return result;
};
