import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import './index.less';
import BtnGroup from '@src/components/BtnGroup/BtnGroup';
import { useParams } from '@src/hooks/useParams';
import { PageLanguage } from '@src/constants/common';
import { LanguageMap, LianlianLogo, YunxiaoweiLogo, XiaoduLogo, GoogleLogo, AlexaLogo } from '@src/constants/authorize';
import querystring from 'query-string';

export default function Authorize() {
  const {
    // eslint-disable-next-line camelcase
    code, account, redirect_uri, state, client_id, language,
  } = useParams();

  const [logo, setLogo] = useState(LianlianLogo);

  useEffect(() => {
    if (!client_id) {
      return;
    }

    if (client_id.indexOf('alexa') !== -1 && !!AlexaLogo) {
      setLogo(AlexaLogo);
    } else if (client_id.indexOf('google') !== -1 && !!GoogleLogo) {
      setLogo(GoogleLogo);
    } else if (client_id.indexOf('yunxiaowei') !== -1 && !!YunxiaoweiLogo) {
      setLogo(YunxiaoweiLogo);
    } else if (client_id.indexOf('xiaodu') !== -1 && !!XiaoduLogo) {
      setLogo(XiaoduLogo);
    }
  }, [client_id]);

  return (
    <div className="authorize">
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

      <header>
        <img src="//main.qcloudimg.com/raw/a1b63cb4e03aae045e0a17b2ae587e82/logo_with_name.png" alt="腾讯连连" className="lianlian-logo"/>

        <span className="account">{LanguageMap[language || PageLanguage.Chinese].account}：{account || '-'}</span>
      </header>

      <main>
        <img src={logo || LianlianLogo} alt="腾讯连连" className="app-logo"/>

        {/* <div className="app-name">腾讯连连</div> */}

        <div className="description">{LanguageMap[language || PageLanguage.Chinese].accessInfo}</div>

        <BtnGroup
          marginTop={30}
          buttons={[
            {
              btnText: LanguageMap[language || PageLanguage.Chinese].authorize,
              type: 'primary',
              onClick: () => {
                window.location.href = querystring.stringifyUrl({
                  url: decodeURIComponent(redirect_uri),
                  query: {
                    code,
                    state,
                  },
                });
              },
            },
          ]}
        />

        <div className="hint-text text-weak">{LanguageMap[language || PageLanguage.Chinese].authHint}</div>
      </main>
    </div>
  );
}
