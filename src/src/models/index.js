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

  return callYunApi('AppGetUserOAuthCode', params, { isTokenApi: false });
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
export async function  AppGetInsuranceAlarmSummaryList(
  InsuranceNo='8b4a70dd16105f******************18edd4e78a3bb8ec'
){
  // return await callYunApi('AppGetInsuranceAlarmSummaryList', {
  //    InsuranceNo
  // }, { isTokenApi: false })
  return  {
    RequestId: "f92406b3-5a9a-4fe8-bc43-45e3d794bb68",
    AlarmSummaries:[{
      "Name":"电流过大预警",
      "Reason":"电流过大会造成火灾隐患",
      "Suggestion":"请立刻停止大功率电器使用",
      "AlarmTimestamp":1599468010,
      "Total":99
    },
    {
      "Name":"电流过大预警1",
      "Reason":"电流过大会造成火灾隐患1",
      "Suggestion":"请立刻停止大功率电器使用1",
      "AlarmTimestamp":1599468011,
      "Total":90
    }]
  }
}
export async function  AppGetInsuranceAlarmDetailList(
  InsuranceNo='8b4a70dd16105f******************18edd4e78a3bb8ec',Name="xxx",
){
  // return await callYunApi('AppGetInsuranceAlarmDetailList', {
  //    InsuranceNo
  // }, { isTokenApi: false })
  return  {
    RequestId: "f92406b3-5a9a-4fe8-bc43-45e3d794bb68",
    Alarms:[{
      "Name":"电流过大预警",
      "Reason":"电流过大会造成火灾隐患",
      "Suggestion":"请立刻停止大功率电器使用",
      "AlarmTimestamp":0
    },
    {
      "Name":"电流过大预警1",
      "Reason":"电流过大会造成火灾隐患1",
      "Suggestion":"请立刻停止大功率电器使用1",
      "AlarmTimestamp":1599468011
    }],
    "Total":1
  }
}
export async function  AppGetInsuranceEvaluation(
  InsuranceNo='8b4a70dd16105f******************18edd4e78a3bb8ec'
){
  // return await callYunApi('AppGetInsuranceEvaluation', {
  //    InsuranceNo
  // }, { isTokenApi: false })
  return  {
    RequestId: "f92406b3-5a9a-4fe8-bc43-45e3d794bb68",
    "Score":79,
    Risks:[{
      "Name":"电流过大",
      "Reason":"电流过大会造成火灾隐患",
      "Suggestion":"请立刻停止大功率电器使用"
    },
    {
      "Name":"电流过大预警1",
      "Reason":"电流过大会造成火灾隐患1",
      "Suggestion":"请立刻停止大功率电器使用1"
    }]
  }
}