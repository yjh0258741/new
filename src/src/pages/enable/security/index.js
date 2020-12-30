import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import './index.less'
import Link from 'next/link'
import router from 'next/router'
import {AppGetInsuranceAlarmSummaryList,AppGetInsuranceEvaluation} from '../../../models'
import date from '../lib/time'

export default function Home() {

  const [securitylist, securitylistfun] = useState([]);
  const [score, setScore] = useState([]);
  const toSkipWarnDetails=(warnName)=>{
      router.push({
        pathname:'/enable/warn-details',
        query:{
            Name:warnName,
        }
      });
  }
  const AppGetInsuranceAlarmSummaryLists = async () => {
    try {
     return await AppGetInsuranceAlarmSummaryList()
    } catch (e) {
      console.log(e);
    }
  }
  const AppGetInsuranceEvaluations = async () => {
    try {
     return await AppGetInsuranceEvaluation()
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(()=>{
    AppGetInsuranceAlarmSummaryLists().then((res)=>{
      securitylistfun(res.AlarmSummaries);
      console.log(res.AlarmSummaries);
    }).catch((err)=>{
      console.log(err);
    })

    AppGetInsuranceEvaluations().then((res)=>{
      console.log(res.Score);
      setScore(res.Score)
    }).catch((err)=>{
      console.log(err);
    })
  },[]);
  return (
    <div className="security-container">
      <Head>
        <title>腾讯连连</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
      </Head>
      <main className='top'>
        <div className='device-status'>
            <div>智能台灯在线</div>
        </div>
        <Link href='/enable/security-details'>
            <div className='score'>
                <div className='score-number'>{score}</div>
                <div className='score-unit'>分</div>
                <div className='safe-score'>安全评分</div>
            </div>
        </Link>
        <Link href='/enable/security-details'>
            <div className='risk'>
                <div className='risk-warn'>
                  <img src='/images/warn.png' />
                </div>  
                <div className='cope-risk'>待处理风险{securitylist.length}个</div>
                <div className='skip'>&gt;</div>
            </div>
        </Link>
      </main>
      <footer className='warn-list'>
        <div className='title'>预警信息</div>
        {
            securitylist.map((obj)=>{{/*列表渲染*/}
            return  <div className='warn-msg' onClick={ev=>toSkipWarnDetails(obj.Name)} key={obj.AlarmTimestamp}>
                          <div className='early-warn'>
                                <div className='warn-reason'>{obj.Name}</div>
                                <div className='warn-amount'>{obj.Total}项</div>
                                <div className='warn-time'>{date(obj.AlarmTimestamp)}</div>
                          </div>
                          <div className='possible-accident'>
                              <div className='accident-reason'>{obj.Reason}</div>
                              <div className='warn-detail'>&gt;</div>
                          </div>
                          <div className='advise'>
                              <div className='warn-advise'>{obj.Suggestion}</div>
                          </div>  
                      </div>
            })
        }
        <Link href='warn-details'>
          <div className='warn-msg'>
              <div className='early-warn'>
                    <div className='warn-reason'>电流过大预警</div>
                    <div className='warn-amount'>10项</div>
                    <div className='warn-time'>2020-11-19 11:37:37</div>
              </div>
              <div className='possible-accident'>
                  <div className='accident-reason'>电流过大会造成火灾隐患</div>
                  <div className='warn-detail'>&gt;</div>
              </div>
              <div className='advise'>
                  <div className='warn-advise'>请立刻停止大功率电器使用</div>
              </div>  
          </div>
        </Link>
      </footer>
    </div>
  );
}
