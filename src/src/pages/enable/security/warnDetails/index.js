import Head from 'next/head'
import './index.less'
import {withRouter} from 'next/router'
import {AppGetInsuranceAlarmDetailList} from '../../../../models'
import React, { useEffect, useState } from 'react';
import date from '../lib/time';
import store from '../rudex'
const warnDetails=function Home({router}){
    const policyNumber=store.getState().InsuranceNo;
    const warnName=router.query.Name;
    const [warnDetailslist, setwarnDetails] = useState([]);
    const [warnDetailsReason, setwarnDetailsReason] = useState([]);
    const [warnDetailsSuggestion, setwarnDetailsSuggestion] = useState([]);
    const AppGetInsuranceAlarmDetailListfun = async (InsuranceNo,Name,Offset,Limit) => {
        try {
            return await AppGetInsuranceAlarmDetailList(InsuranceNo,Name,Offset,Limit)
        } catch (e) {
            console.log(e);
        }
    }
    
    useEffect(()=>{
        AppGetInsuranceAlarmDetailListfun({InsuranceNo:policyNumber,Name:warnName,Offset:0,Limit:10}).then((res)=>{
            setwarnDetails(res.Alarms);
            setwarnDetailsReason(res.Alarms[0].Reason);
            setwarnDetailsSuggestion(res.Alarms[0].Suggestion);
            console.log(policyNumber);
        }).catch((err)=>{
            console.log(err);
        })
    },[]);
    function toSkipWarnSet(){
        router.push({
            pathname:'/enable/security/warnSet',
            query:{
                Name:warnName
            }
          });
    }
    return(
        <div className="warnDetails">
            <Head>
            <title>腾讯连连</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name="viewport" content="width=width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
            </Head> 
            <main className='warn'>
                    <div className='warnSet' onClick={toSkipWarnSet}><img src='/images/seting.png' className='setPic'/></div>
                    <div className='warnTitle'>{warnName}</div>
                    <div className='warnMain'>
                        <div className='warnAnalyse'>
                            <div className='analyseTitle'>隐患分析</div>
                            <div className='analyseReason'>{warnDetailsReason}</div>
                        </div>
                        <div className='warnAdvise'>
                            <div className='adviseTitle'>处理建议</div>
                            <div className='copeAdvise'>{warnDetailsSuggestion}</div>
                        </div>
                    </div>
            </main>
            <footer className='warnMsg'>
                <div className='title'>
                    <div className='warnTitle'>预警信息</div>
                    <div className='month'>
                        <div className='monthTime'>近30天</div>
                        <img src='/images/downarrow.png' /></div>
                </div>
                {
                    warnDetailslist.map(obj=>{
                      return <div className='warnContent' key={obj.AlarmTimestamp}>
                                <div className='warnReason'>{obj.Name}</div>
                                <div className='warnTime'>{date(obj.AlarmTimestamp)}</div>
                            </div>   
                    })
                }
            </footer>
        </div>
    )
}
export default withRouter(warnDetails);