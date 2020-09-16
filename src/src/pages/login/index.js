import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import './index.less';
import GlobalComponents from '@src/components/GlobalComponents/GlobalComponents';
import { useGlobalHooks } from '@src/hooks/useGlobalHooks';
import { useParams } from '@src/hooks/useParams';
import { getAuthCode } from '@src/models/index';
import { AccountType, LoginType, LanguageMap } from '@src/constants/login';
import { PageLanguage } from '@src/constants/common';
import classNames from 'classnames';
import PhoneForm from './components/PhoneForm';
import EmailForm from './components/EmailForm';

export const userRequestInfo = {
  regionId: 1,
  uin: 'explorerOAuth',
};

export default function Login() {
  const {
    globalComponents: [components, { getLoadingBar, getTips }],
  } = useGlobalHooks();

  // eslint-disable-next-line camelcase
  const { redirect_uri, state, client_id, uin } = useParams();
  userRequestInfo.uin = uin;

  const [language, setLanguage] = useState(PageLanguage.Chinese);
  const [accountType, setAccountType] = useState(AccountType.Phone);
  const [loginType, setLoginType] = useState(LoginType.VerificationCode);

  useEffect(() => {
    if (!client_id) {
      return;
    }

    if (client_id.indexOf('alexa') !== -1 || client_id.indexOf('google') !== -1) {
      setLanguage(PageLanguage.English);
      Object.assign(userRequestInfo, {
        regionId: 22,
      });
    } else {
      setLanguage(PageLanguage.Chinese);
    }
  }, [client_id]);

  const onToggleAccountType = (type) => setAccountType(type);

  const onToggleLoginType = (type) => setLoginType(type);

  const onSubmit = async ({
    UserType,
    UserName,
    Password = '',
    VerificationCode = '',
    CountryCode = '',
    PhoneNumber = '',
    Email = '',
  }) => {
    const { Code } = await getAuthCode({
      UserType,
      UserName,
      Password,
      CountryCode,
      PhoneNumber,
      Email,
      VerificationCode,
    });

    if (!Code) {
      return components.tips.showError('获取登录信息失败，请稍后再试');
    }

    Router.push({
      pathname: '/scf/explorerh5oauth/authorize',
      // pathname: '/authorize',
      query: {
        code: Code,
        account: UserType === AccountType.Phone ? `${CountryCode}${PhoneNumber}` : Email,
        redirect_uri,
        client_id,
        language,
        state,
        uin: uin || 'explorerOAuth',
      },
    });
  };

  return (
    <div className="login-container">
      <Head>
        <title>腾讯连连</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
        {/* eslint-disable react/self-closing-comp */
          /* eslint-disable react/no-danger */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.onload = function () {
                document.addEventListener('touchstart', function (event) {
                  if (event.touches.length > 1) {
                    event.preventDefault();
                  }
                });
                var lastTouchEnd = 0;
                document.addEventListener('touchend', function (event) {
                  var now=(new Date()).getTime();
                  if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                  }
                  lastTouchEnd = now;
                }, false);
                document.addEventListener('gesturestart', function (event) {
                  event.preventDefault();
                });
              }
            `,
          }}
        >
        </script>
      </Head>

      <main>
        <div className="logo">
          <img src="//main.qcloudimg.com/raw/c23f01343fcdb4a5e945b896e1874dce/logo.png" alt="腾讯连连" className="logo-image"/>
          {/* <img src="/scf/explorerh5oauth/images/logo.png" alt="腾讯连连" className="logo-image"/> */}
          {/* <img src="/images/logo.png" alt="腾讯连连" className="logo-image"/> */}
          <div className="logo-text">{LanguageMap[language || PageLanguage.Chinese].welcome}</div>
        </div>

        <div className="login-input">
          {accountType === AccountType.Phone ? (
            <PhoneForm
              components={components}
              language={language}
              onSubmit={onSubmit}
              loginType={loginType}
            />
          ) : (
            <EmailForm
              components={components}
              language={language}
              onSubmit={onSubmit}
              loginType={loginType}
            />
          )}
        </div>

        <div className="extra-function">
          {loginType === LoginType.VerificationCode ? (
            <div
              className="text-link"
              onClick={() => onToggleLoginType(LoginType.Password)}
              role="link"
            >
              {LanguageMap[language || PageLanguage.Chinese].pwdLogin}
            </div>
          ) : (
            <div
              className="text-link"
              onClick={() => onToggleLoginType(LoginType.VerificationCode)}
              role="link"
            >
              {LanguageMap[language || PageLanguage.Chinese].codeLogin}
            </div>
          )}

          <div className="language-setting">
            <div
              className={classNames({
                'text-link': language === PageLanguage.Chinese
              })}
              onClick={() => {
                if (language === PageLanguage.Chinese) {
                  setLanguage(PageLanguage.English);
                }
              }}
              role="link"
            >
              EN
            </div>
            <span>/</span>
            <div
              className={classNames({
                'text-link': language === PageLanguage.English
              })}
              onClick={() => {
                if (language === PageLanguage.English) {
                  setLanguage(PageLanguage.Chinese);
                }
              }}
              role="link"
            >
              中文
            </div>
          </div>
        </div>

        <div className="optional-login">
          <div className="optional-text">
            <p>{LanguageMap[language || PageLanguage.Chinese].otherLogin}</p>
          </div>

          <div className="optional-btn">

            {accountType === AccountType.Phone && (
              <div
                className="mail-login"
                onClick={() => onToggleAccountType(AccountType.Email)}
                role="button"
              >
                <img
                  src="//main.qcloudimg.com/raw/5da0639954b88eaaa02a2297a20c03af/mail.png"
                  // src="/scf/explorerh5oauth/images/mail.png"
                  // src="/images/mail.png"
                  alt={LanguageMap[language || PageLanguage.Chinese].email}
                />
                <p>{LanguageMap[language || PageLanguage.Chinese].email}</p>
              </div>
            )}

            {accountType === AccountType.Email && (
              <div
                className="phone-login"
                onClick={() => onToggleAccountType(AccountType.Phone)}
                role="button"
              >
                <img
                  src="//main.qcloudimg.com/raw/a5c0033450080257c3774daa70fec31d/phone.png"
                  // src="/scf/explorerh5oauth/images/phone.png"
                  // src="/images/phone.png"
                  alt={LanguageMap[language || PageLanguage.Chinese].phone}
                />
                <p>{LanguageMap[language || PageLanguage.Chinese].phone}</p>
              </div>
            )}
          </div>

        </div>
      </main>

      <footer className="copyright">
        <p>Copyright@2013-{new Date().getFullYear()} Tencent Cloud All Right Reserved.</p>
        <p>腾讯云 版权所有</p>
      </footer>

      <GlobalComponents
        getTips={getTips}
        getLoadingBar={getLoadingBar}
      />
    </div>
  );
}
