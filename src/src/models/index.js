import { callYunApi } from '@src/lib/request';

export async function getAuthCode({
  UserType,
  Password,
  CountryCode = '',
  PhoneNumber = '',
  Email = '',
}) {
  let params = {
    UserType,
    Password,
  };

  if (UserType === 'phone') {
    params = {
      ...params,
      CountryCode,
      PhoneNumber,
    };
  } else if (UserType === 'email') {
    params = {
      ...params,
      Email,
    };
  }

  return callYunApi('AppGetUserOAuthCode', params);
};
