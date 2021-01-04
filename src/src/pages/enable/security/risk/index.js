import React, { useEffect, useState,useRef } from 'react';
import Head from 'next/head'
import './index.less'
import Link from 'next/link'
import {AppGetInsuranceAlarmSummaryList,AppGetInsuranceEvaluation,AppGetInsuranceDeviceStatus} from '../../../../models'
import date from '../lib/time'
import store from '../rudex'
import {withRouter} from 'next/router'
import Reset from '../component/reset'
import { isArray } from 'lodash';
const risk=function Home({router}) {
  const policyNumber=router.query.InsuranceNo;
  const [securitylist, setSecuritylist] = useState([]);
  const [score, setScore] = useState([]);
  const circle=useRef();
  const [devices,setDevices]=useState([]);
  const toSkipWarnDetails=(warnName)=>{
      router.push({
        pathname:'/enable/security/warnDetails',
        query:{
            Name:warnName
        }
      });
  }
  const AppGetInsuranceAlarmSummaryLists = async ({InsuranceNo=""}) => {
    try {
     return await AppGetInsuranceAlarmSummaryList(InsuranceNo)
    } catch (e) {
      console.log(e);
    }
  }
  const AppGetInsuranceEvaluations = async ({InsuranceNo=""}) => {
    try {
     return await AppGetInsuranceEvaluation(InsuranceNo)
    } catch (e) {
      console.log(e);
    }
  }
  const AppGetInsuranceDeviceStatuslist = async ({InsuranceNo=""}) => {
    try {
     return await AppGetInsuranceDeviceStatus(InsuranceNo)
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(()=>{
    AppGetInsuranceAlarmSummaryLists({InsuranceNo:policyNumber}).then((res)=>{
      setSecuritylist(res.AlarmSummaries);
      console.log();
    }).catch((err)=>{
      console.log(err);
    });
    AppGetInsuranceDeviceStatuslist({InsuranceNo:policyNumber}).then((res)=>{
      setDevices(res.Devices);
    }).catch((err)=>{
      console.log(err);
    });
  },[]);
  useEffect(()=>{
    AppGetInsuranceEvaluations({InsuranceNo:policyNumber}).then((res)=>{
      setScore(res.Score);
    }).catch((err)=>{
      console.log(err);
    });
    let progressRound =circle;
    let jindu = 0;
    let jinduLength = Math.PI*2;
    if(score>=80){
      progressRound.current && (progressRound.current.style.stroke='#00ff00')
    }else if(score>=60){
      progressRound.current && (progressRound.current.style.stroke='#ffff00')
    }else{
      progressRound.current && (progressRound.current.style.stroke='#f00')
    }
    let goFun = ()=>{
        if(score==0){
          return
        }
        jindu +=0.5 ;
        let strokeLength = jinduLength*jindu ;
        if(progressRound.current){
          if(score>=35&&score<=50){
            progressRound.current.style.strokeDasharray = (strokeLength-30)+" 1000";
          }else{
            progressRound.current.style.strokeDasharray = strokeLength+" 1000";
          }
        }
        if( jindu >= score+10 ){
            clearInterval( myset );
        }
    };
    // 启动计时器
    let myset = setInterval(function(){
        goFun();
    },5);
    store.dispatch({type:'val',value:policyNumber});
  },[score]);
  function resetClick(){
    AppGetInsuranceAlarmSummaryLists({InsuranceNo:policyNumber}).then((res)=>{
        setSecuritylist(res.AlarmSummaries);
       
      }).catch((err)=>{
        console.log(err);
      });
  
      AppGetInsuranceEvaluations({InsuranceNo:policyNumber}).then((res)=>{
        setScore(res.Score);
      }).catch((err)=>{
        console.log(err);
      });
  }
  return (
    <div className="securityContainer">
      <Head>
        <title>腾讯连连</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
      </Head>
      <main className='top'>    
              {
                devices.map((obj,item)=>{
                  return <div className='deviceStatus' key={item}>
                    {obj.ProductName}{obj.OnlineStatus==1?'在线':'离线'}
                  </div> 
                })
              }
              <Link href='/enable/security/securityDetails'>
                  <div>
                    <svg  viewBox="0 0 220 220" className='score '>
                        <circle cx="110"  cy="110"   r = "110"fill="none"  stroke="#eee" strokeWidth="0.8vw">
                        </circle>
                        <circle cx="0"  cy="0"   r = "110" className="mycircle" ref={circle}
                            transform="translate(110,110) rotate(-90)">
                        </circle>
                    </svg>
                        <div className='scoreNumber' >{score}</div>
                        <div className='scoreUnit'>分</div>
                        <div className='safeScore'>安全评分</div>
                  </div>
              </Link>
              {
                  isArray(score)?
                  <Reset resetClick={resetClick}></Reset>
                  :<Link href='/enable/security/securityDetails'>
                  <div className='risk'>
                      <div className='riskWarn'>
                        <img src='/images/warn.png' />
                      </div>  
                      <div className='copeRisk'>待处理风险{securitylist.length}个</div>
                      <span className='skip'>&gt;</span>
                  </div>
                </Link>
              }
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
export default withRouter(risk)