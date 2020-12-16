import { PageLanguage } from './common';

export const AccountType = {
  Phone: 'phone',
  Email: 'email',
};

export const LoginType = {
  Password: 'password',
  VerificationCode: 'verificationCode'
};

export const UserNotExistTip = {
  [PageLanguage.Chinese]: '您的账号暂未注册，请前往腾讯连连小程序或APP绑定账号后重新登录',
  [PageLanguage.English]: 'Your account is not registered yet, please go to TencentLianlian to bind your account and try again.'
};

export const LanguageMap = {
  [PageLanguage.Chinese]: {
    welcome: '欢迎使用腾讯连连',
    pwdLogin: '账号密码登录',
    codeLogin: '验证码登录',
    otherLogin: '其他登录方式',
    email: '邮箱',
    phone: '手机号',
    region: '国家/地区',
    phoneHint: '请输入手机号码',
    phoneErrorTip: '请输入正确的手机号',
    emailHint: '请输入邮箱',
    emailErrorTip: '请输入正确的邮箱',
    code: '验证码',
    codeHint: '6位数字验证码',
    codeTip: '请输入验证码',
    codeErrorTip: '请输入6位数字验证码',
    getCode: '获取验证码',
    resend: '重新发送',
    sending: '发送中',
    password: '密码',
    pwdHint: '请输入密码',
    login: '登录',
  },
  [PageLanguage.English]: {
    welcome: 'Welcome to TencentLianlian',
    pwdLogin: 'Account password login',
    codeLogin: 'Verification code login',
    otherLogin: 'Other login',
    email: 'E-mail',
    phone: 'Phone',
    region: 'Region',
    phoneHint: 'Please enter phone number',
    phoneErrorTip: 'Please enter a valid phone number',
    emailHint: 'Please enter E-mail',
    emailErrorTip: 'Please enter a valid E-mail',
    code: 'Verify code',
    codeHint: 'Verify code',
    codeTip: 'Please enter verification code',
    codeErrorTip: 'Please enter correct verification code',
    getCode: 'Get code',
    resend: 'Resend',
    sending: 'Sending',
    password: 'Password',
    pwdHint: 'Please enter password',
    login: 'Log in',
  },
};
