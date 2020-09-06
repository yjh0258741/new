import React, { useMemo } from 'react';
import { CountryCodeList, PageLanguage } from '@src/constants/common';

export const useCountryCodePicker = ({ language }) => useMemo(() => CountryCodeList.map((item) => ({
  text: `${language === PageLanguage.English ? item.EnName : item.Name}(+${item.Code})`,
  value: item.Code,
})), [CountryCodeList, language]);
