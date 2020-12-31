import React, { useEffect, useState,useRef } from 'react';
import Head from 'next/head'
import './index.less'
import Link from 'next/link'
import router from 'next/router'
import {AppGetInsuranceAlarmSummaryList,AppGetInsuranceEvaluation,AppGetInsuranceDeviceStatus} from '../../../../models'
import date from '../lib/time'
import letter from '../lib/text'
import classNames from 'classnames';

export default function Home() {
  const scoreRef = useRef();
  const circleRef=useRef();
  const [securitylist, securitylistfun] = useState([]);
  const [score, setScore] = useState([]);
  const [devices,setDevices]=useState([]);
  const toSkipWarnDetails=(warnName)=>{
      router.push({
        pathname:'/enable/security/warnDetails',
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
  const AppGetInsuranceDeviceStatuslist = async () => {
    try {
     return await AppGetInsuranceDeviceStatus()
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
      
      setScore(res.Score);
    }).catch((err)=>{
      console.log(err);
    })
    AppGetInsuranceDeviceStatuslist().then((res)=>{
      setDevices(res.Devices);
    }).catch((err)=>{
      console.log(err);
    })
  },[]);
  function www(){
    console.log(letter('超过的文字用省略号代替的js写法',22));
  }
  return (
    <div className="securityContainer">
      <Head>
        <title>腾讯连连</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
      </Head>
      <main className='top'>
        <Link href='/enable/security/securityDetails'>
          <div>    
              {
                devices.map((obj,item)=>{
                  return <div className='deviceStatus' key={item}>
                    {obj.ProductName}{obj.OnlineStatus==1?'在线':'离线'}
                  </div> 
                })
              }
            <div className={classNames('score', {
              'scoreGreen ': score>80&&score<100,
              'scoreYello':score>60&&score<80,
              'scoreRed':score<60
              })}>
                <div className='scoreNumber' >{score}</div>
                <div className='scoreUnit'>分</div>
                <div className='safeScore'>安全评分</div>
            </div>
          </div> 
        </Link>
        <Link href='/enable/securityDetails'>
            <div className='risk'>
                <div className='riskWarn'>
                  <img src='/images/warn.png' />
                </div>  
                <div className='copeRisk'>待处理风险{securitylist.length}个</div>
                <div className='skip'>&gt;</div>
            </div>
        </Link>
      </main>
      <footer className='warnList'>
        <div className='title'>预警信息</div>
        {
            securitylist.map((obj)=>{{/*列表渲染*/}
            return  <div className='warnMsg' onClick={ev=>toSkipWarnDetails(obj.Name)} key={obj.AlarmTimestamp}>
                          <div className='earlyWarn'>
                                <div className='warntext'>
                                  <div className='warnReason'>{obj.Name}</div>
                                  <div className='warnAmount'>{obj.Total>99?'99+项':obj.Total+'项'}</div>
                                </div>
                                <div className='warnTime'>{date(obj.AlarmTimestamp)}</div>
                          </div>
                          <div className='possibleAccident'>
                              <div className='accidentReason'>{obj.Reason}</div>
                              <div className='warnDetail'>&gt;</div>
                          </div>
                          <div className='advise'>
                              <div className='warnAdvise'>{obj.Suggestion}</div>
                          </div>  
                    </div>
            })
        }
      </footer>
    </div>
  );
}
