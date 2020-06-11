import { noop } from '@src/lib/utillib';
import LoadingBar from '../LoadingBar/LoadingBar';
import Tips from '../Tips/Tips';

export default function GlobalComponents({
  getLoadingBar = noop,
  getTips = noop,
}) {
  return (
    <>
      <LoadingBar
        getInner={getLoadingBar}
      />
      <Tips
        getInner={getTips}
      />
    </>
  );
}
