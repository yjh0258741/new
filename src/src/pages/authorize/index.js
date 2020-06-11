import Head from 'next/head';
import './index.less';
import BtnGroup from '@src/components/BtnGroup/BtnGroup';
import { useParams } from '@src/hooks/useParams';
import querystring from 'query-string';

export default function Authorize() {
  const { code, account, redirect_uri, state } = useParams();

  return (
    <div className="authorize">
      <Head>
        <title>腾讯连连</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
      </Head>

      <header>
        <img src="/scf/explorerh5oauth/images/logo_with_name.png" alt="腾讯连连" className="lianlian-logo"/>
        {/* <img src="/images/logo_with_name.png" alt="腾讯连连" className="lianlian-logo"/> */}

        <span className="account">账号：{account || '-'}</span>
      </header>

      <main>
        <img src="/scf/explorerh5oauth/images/logo.png" alt="腾讯云小微" className="app-logo"/>
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
  )
};
