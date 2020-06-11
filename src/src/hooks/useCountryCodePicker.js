import React, { useMemo } from 'react';
import { CountryCodeList } from '@src/constants/common';

export const useCountryCodePicker = () => useMemo(() => CountryCodeList.map(item => ({
  text: `${item.Name}(+${item.Code})`,
  value: item.Code,
})), [CountryCodeList]);
