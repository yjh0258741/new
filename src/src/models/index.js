import { callYunApi } from '@src/lib/request';

export async function getAuthCode({
  UserType,
  Password = '',
  VerificationCode = '',
  CountryCode = '',
  PhoneNumber = '',
  Email = '',
}) {
  let params = {
    UserType,
    Password,
    VerificationCode,
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
}

export async function sendPhoneVerifyCode({
  Type = 'login', // register/resetpass/login
  CountryCode = '86',
  PhoneNumber,
}) {
  return callYunApi('AppSendVerificationCode', {
    Type,
    CountryCode,
    PhoneNumber: String(PhoneNumber),
  }, { isTokenApi: false });
}

export async function sendEmailVerifyCode({
  Type = 'login', // register/resetpass/login
  Email,
}) {
  return callYunApi('AppSendEmailVerificationCode', {
    Type,
    Email,
  }, { isTokenApi: false });
}
