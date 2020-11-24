import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import './index.less';
import BtnGroup from '@src/components/BtnGroup/BtnGroup';
import SectionList from '@src/components/SectionList/SectionList';
import SectionItem from '@src/components/SectionList/SectionItem';
import { useCountryCodePicker } from '@src/hooks/useCountryCodePicker';
import { useFormControl } from '@src/hooks/useFormControl';
import { isNumber } from '@src/lib/utillib';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>腾讯连连</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
      </Head>

      <main>
        <div className="logo">
          <img src="//main.qcloudimg.com/raw/c23f01343fcdb4a5e945b896e1874dce/logo.png" alt="腾讯连连" className="logo-image"/>
          {/* <img src="/scf/explorerh5oauth/images/logo.png" alt="腾讯连连" className="logo-image"/> */}
          {/* <img src="/images/logo.png" alt="腾讯连连" className="logo-image"/> */}
          <div className="logo-text">欢迎使用腾讯连连</div>
        </div>
      </main>

      <footer className="copyright">
        <p>Copyright@2013-{new Date().getFullYear()} Tencent Cloud All Right Reserved.</p>
        <p>腾讯云 版权所有</p>
      </footer>
    </div>
  )
}
