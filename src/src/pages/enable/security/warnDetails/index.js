import Head from 'next/head'
import './index.less'
import {withRouter} from 'next/router'
import {AppGetInsuranceAlarmDetailList} from '../../../../models'
import React, { useEffect, useState } from 'react';
import date from '../lib/time';

const warnDetails=function Home({router}){
    const [warnDetailslist, setwarnDetails] = useState([]);
    const [warnDetailsReason, setwarnDetailsReason] = useState([]);
    const [warnDetailsSuggestion, setwarnDetailsSuggestion] = useState([]);
    const AppGetInsuranceAlarmDetailListfun = async () => {
        try {
        return await AppGetInsuranceAlarmDetailList()
        } catch (e) {
        console.log(e);
        }
    }
    
    useEffect(()=>{
        AppGetInsuranceAlarmDetailListfun().then((res)=>{
        setwarnDetails(res.Alarms);
        setwarnDetailsReason(res.Alarms[0].Reason);
        setwarnDetailsSuggestion(res.Alarms[0].Suggestion);
        }).catch((err)=>{
        console.log(err);
        })
    },[]);
    return(
        <div className="warn-details">
            <Head>
            <title>腾讯连连</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name="viewport" content="width=width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
            </Head> 
            <main className='warn'>
                    <div className='warn-set'><img src='/images/seting.png' className='set-pic'/></div>
                    <div className='warn-title'>{router.query.Name}</div>
                    <div className='warn-main'>
                        <div className='warn-analyse'>
                            <div className='analyse-title'>隐患分析</div>
                            <div className='analyse-reason'>{warnDetailsReason}</div>
                        </div>
                        <div className='warn-advise'>
                            <div className='advise-title'>处理建议</div>
                            <div className='cope-advise'>{warnDetailsSuggestion}</div>
                        </div>
                    </div>
            </main>
            <footer className='warn-msg'>
                <div className='title'>
                    <div className='warn-title'>预警信息</div>
                    <div className='month'>
                        <div className='month-time'>近30天</div>
                        <img src='/images/downarrow.png' /></div>
                </div>
                {
                    warnDetailslist.map(obj=>{
                      return <div className='warn-content' key={obj.AlarmTimestamp}>
                                <div className='warn-reason'>{obj.Name}</div>
                                <div className='warn-time'>{date(obj.AlarmTimestamp)}</div>
                            </div>   
                    })
                }
                <div className='warn-content'>
                    <div className='warn-reason'>电流值大于1A</div>
                    <div className='warn-time'>2020-11-19 23:23:23</div>
                </div>
                <div className='warn-content'>
                    <div className='warn-reason'>电流值大于1A</div>
                    <div className='warn-time'>2020-11-19 23:23:23</div>
                </div>
            </footer>
        </div>
    )
}
export default withRouter(warnDetails);