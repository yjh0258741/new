import Head from 'next/head'
import Link from 'next/link'
import './index.less'
import React, { useEffect, useState,useRef } from 'react';
import {AppGetInsuranceEvaluation} from '../../../../models'
import store from '../rudex'
export default function Home(){
    const policyNumber=store.getState().InsuranceNo;
    const [scorelist, setScorelist] = useState([]);
    const circle=useRef();
    const circleNumber=useRef();
    const [score, setscore] = useState([]);
    const AppGetInsuranceEvaluations = async (InsuranceNo) => {
        try {
         return await AppGetInsuranceEvaluation(InsuranceNo)
        } catch (e) {
          console.log(e);
        }
    }
    const scoreEvaluate=()=>{
        if(score>80){
            return '恭喜您，安全状况良好'
        }else if(score>60){
            return '安全状况还有改善空间'
        }else{
            return '安全状况不佳，需立即改善'
        }
    } 
    useEffect(()=>{
        AppGetInsuranceEvaluations({InsuranceNo:policyNumber}).then((res)=>{
            setScorelist(res.Risks);
            setscore(res.Score);
            console.log(policyNumber);
        }).catch((err)=>{
            console.log(err);
        })
    },[])
    useEffect(()=>{
        AppGetInsuranceEvaluations({InsuranceNo:policyNumber}).then((res)=>{
          setScore(res.Score);
        }).catch((err)=>{
          console.log(err);
        });
        let progressRound =circle;
        let circleNumber1=circleNumber;
        let jindu = 0;
        let jinduLength = Math.PI*2;
        if(score>=80&&progressRound.current&&circleNumber1.current){
            progressRound.current.style.stroke='#00ff00';
            circleNumber1.current.style.color='#00ff00';
        }else if(score>=60){
            progressRound.current.style.stroke='#ffff00';
            circleNumber1.current.style.color='#ffff00';
        }else{
            progressRound.current.style.stroke='#f00';
            circleNumber1.current.style.color='#f00';
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

   
    return(
        <div className="detailsContainer">
            <Head>
            <title>腾讯连连</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name="viewport" content="width=width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
            </Head> 
            <main className='top'>
                <div className='circularRing'>
                    <svg  viewBox="0 0 220 220" className='score '>
                        <circle cx="110"  cy="110"   r = "110"fill="none"  stroke="#0066FF" strokeWidth="0.8vw">
                        </circle>
                        <circle cx="0"  cy="0"   r = "110" className="mycircle" ref={circle}
                            transform="translate(110,110) rotate(-90)">
                        </circle>
                    </svg>
                    <span className='scoreNumber' ref={circleNumber}>{score}</span>
                </div>
                <div className='evaluate'>{scoreEvaluate()}</div>
            </main>
            <footer className='reason'>
                {
                    scorelist.map((obj,item)=>{
                     return   <div className='warnMessage' key={item}>
                                <div className='warnTitle'>{obj.Name}</div>
                                <div className='warnMain'>
                                    <div className='warnAnalyse'>
                                        <div className='analyseTitle'>隐患分析</div>
                                        <div className='analyseReason'>{obj.Reason}</div>
                                    </div>
                                    <div className='warnAdvise'>
                                        <div className='adviseTitle'>处理建议</div>
                                        <div className='copeAdvise'>{obj.Suggestion}</div>
                                    </div>
                                </div>
                            </div>
                    })
                }
                <div className='warnMessage'>
                    <div className='warnTitle'>电流过大</div>
                    <div className='warnMain'>
                        <div className='warnAnalyse'>
                            <div className='analyseTitle'>隐患分析</div>
                            <div className='analyseReason'>电流过大会造成火灾隐患</div>
                        </div>
                        <div className='warnAdvise'>
                            <div className='adviseTitle'>处理建议</div>
                            <div className='copeAdvise'>请立刻停止大功率电器使用</div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}