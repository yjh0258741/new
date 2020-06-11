import { useGlobalComponents } from '@src/components/GlobalComponents/useGlobalComponents';
import { useParams } from './useParams';

export const useGlobalHooks = () => {
  const params = useParams();
  const [components, { getLoadingBar, getTips }] = useGlobalComponents();

  return {
    params,
    globalComponents: [components, { getLoadingBar, getTips }],
  };
};
