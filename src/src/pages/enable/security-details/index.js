import Head from 'next/head'
import Link from 'next/link'
import './index.less'
import React, { useEffect, useState } from 'react';
import {AppGetInsuranceEvaluation} from '../../../models'
export default function Home(){
    const [scorelist, setscorelist] = useState([]);
    const AppGetInsuranceEvaluations = async () => {
        try {
         return await AppGetInsuranceEvaluation()
        } catch (e) {
          console.log(e);
        }
    }
    useEffect(()=>{
        AppGetInsuranceEvaluations().then((res)=>{
            console.log(res.Risks);
            setscorelist(res.Risks)
        }).catch((err)=>{
            console.log(err);
        })
    },[])
   
    return(
        <div className="details-container">
            <Head>
            <title>腾讯连连</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name="viewport" content="width=width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
            </Head> 
            <main className='top'>
                <div className='score'>
                    <div className='score-number'>100</div>
                </div>
                <div className='evaluate'>恭喜您,安全状况良好</div>
            </main>
            <footer className='reason'>
                {
                    scorelist.map((obj)=>{
                     return   <div className='warn-message'>
                                <div className='warn-title'>{obj.Name}</div>
                                <div className='warn-main'>
                                    <div className='warn-analyse'>
                                        <div className='analyse-title'>隐患分析</div>
                                        <div className='analyse-reason'>{obj.Reason}</div>
                                    </div>
                                    <div className='warn-advise'>
                                        <div className='advise-title'>处理建议</div>
                                        <div className='cope-advise'>{obj.Suggestion}</div>
                                    </div>
                                </div>
                            </div>
                    })
                }
                <div className='warn-message'>
                    <div className='warn-title'>电流过大</div>
                    <div className='warn-main'>
                        <div className='warn-analyse'>
                            <div className='analyse-title'>隐患分析</div>
                            <div className='analyse-reason'>电流过大会造成火灾隐患</div>
                        </div>
                        <div className='warn-advise'>
                            <div className='advise-title'>处理建议</div>
                            <div className='cope-advise'>请立刻停止大功率电器使用</div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}