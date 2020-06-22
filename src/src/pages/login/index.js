import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import './index.less';
import PhoneForm from './components/PhoneForm';
import EmailForm from './components/EmailForm';
import GlobalComponents from '@src/components/GlobalComponents/GlobalComponents';
import { useGlobalHooks } from '@src/hooks/useGlobalHooks';
import { useParams } from '@src/hooks/useParams';
import { getAuthCode } from '@src/models/index';

const LoginType = {
  Phone: 'phone',
  Email: 'email',
};

export default function Login() {
  const {
    globalComponents: [components, { getLoadingBar, getTips }],
  } = useGlobalHooks();

  const { redirect_uri, state } = useParams();

  const [loginType, setLoginType] = useState(LoginType.Phone);

  const onToggleLoginType = (type) => {
    setLoginType(type);
  };

  const onSubmit = async ({
    UserType,
    UserName,
    Password,
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
    });

    if (!Code) {
      return components.tips.showError('获取登录信息失败，请稍后再试');
    }

    Router.push({
      pathname: '/authorize',
      query: {
        code: Code,
        account: UserType === LoginType.Phone ? `${CountryCode}${PhoneNumber}` : Email,
        redirect_uri,
        state,
      },
    });
  };

  return (
    <div className="login-container">
      <Head>
        <title>腾讯连连</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
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
          <img src="/scf/explorerh5oauth/images/logo.png" alt="腾讯连连" className="logo-image"/>
          {/* <img src="/images/logo.png" alt="腾讯连连" className="logo-image"/> */}
          <div className="logo-text">欢迎使用腾讯连连</div>
        </div>

        <div className="login-input">
          {loginType === LoginType.Phone ? (
            <PhoneForm
              components={components}
              onSubmit={onSubmit}
            />
          ) : (
            <EmailForm
              components={components}
              onSubmit={onSubmit}
            />
          )}
        </div>

        {/* <div className="extra-function">
          <div className="forget-password"><a href="">忘记密码</a></div>
          <div className="register">还没有账号？<a href="">注册账号</a></div>
        </div> */}

        <div className="optional-login">
          <div className="optional-text">
            <p>其他登录方式</p>
          </div>

          <div className="optional-btn">
            {/* <div className="wechat-login">
              <img src="/scf/explorerh5oauth/images/wechat.png" alt="微信"/>
              <img src="/images/wechat.png" alt="微信"/>
              <p>微信</p>
            </div> */}

            {loginType === LoginType.Phone && (
              <div className="mail-login" onClick={() => onToggleLoginType(LoginType.Email)}>
                <img
                  src="/scf/explorerh5oauth/images/mail.png"
                  // src="/images/mail.png"
                  alt="邮箱"
                />
                <p>邮箱</p>
              </div>
            )}

            {loginType === LoginType.Email && (
              <div className="phone-login" onClick={() => onToggleLoginType(LoginType.Phone)}>
                <img
                  src="/scf/explorerh5oauth/images/phone.png"
                  // src="/images/phone.png"
                  alt="手机号"
                />
                <p>手机号</p>
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
  )
}
