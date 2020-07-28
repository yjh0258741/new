import Head from 'next/head';
import './index.less';
import BtnGroup from '@src/components/BtnGroup/BtnGroup';
import { useParams } from '@src/hooks/useParams';
import querystring from 'query-string';

export default function Authorize() {
  const {
    // eslint-disable-next-line camelcase
    code, account, redirect_uri, state,
  } = useParams();

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
        {/* <img src="/scf/explorerh5oauth/images/logo_with_name.png" alt="腾讯连连" className="lianlian-logo"/> */}
        {/* <img src="/images/logo_with_name.png" alt="腾讯连连" className="lianlian-logo"/> */}

        <span className="account">账号：{account || '-'}</span>
      </header>

      <main>
        <img src="//main.qcloudimg.com/raw/c23f01343fcdb4a5e945b896e1874dce/logo.png" alt="腾讯云小微" className="app-logo"/>
        {/* <img src="/scf/explorerh5oauth/images/logo.png" alt="腾讯云小微" className="app-logo"/> */}
        {/* <img src="/images/logo.png" alt="腾讯云小微" className="app-logo"/> */}

        <div className="app-name">腾讯云小微</div>

        <div className="description">将会：访问你的账号信息；访问你的设备控制权</div>

        <BtnGroup
          marginTop={30}
          buttons={[
            {
              btnText: '授权',
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

        <div className="hint-text text-weak">授权后，您可随时取消授权</div>
      </main>
    </div>
  );
}
