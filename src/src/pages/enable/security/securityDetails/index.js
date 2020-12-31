import Head from 'next/head'
import Link from 'next/link'
import './index.less'
import React, { useEffect, useState } from 'react';
import {AppGetInsuranceEvaluation} from '../../../../models'
import classNames from 'classnames';
export default function Home(){
    const [scorelist, setScorelist] = useState([]);
    const [score, setscore] = useState([]);
    const AppGetInsuranceEvaluations = async () => {
        try {
         return await AppGetInsuranceEvaluation()
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
        AppGetInsuranceEvaluations().then((res)=>{
            console.log(res.Risks);
            console.log(res);
            setScorelist(res.Risks);
            setscore(res.Score);
        }).catch((err)=>{
            console.log(err);
        })
    },[])


   
    return(
        <div className="detailsContainer">
            <Head>
            <title>腾讯连连</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name="viewport" content="width=width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
            </Head> 
            <main className='top'>
                <div className='score'>
                    <div className={classNames('scoreNumber', {
                        'scoreGreen ': score>80&&score<100,
                        'scoreYello':score>60&&score<80,
                        'scoreRed':score<60
                    })}>{score}</div>
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