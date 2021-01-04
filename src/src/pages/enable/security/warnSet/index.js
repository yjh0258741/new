import Head from 'next/head'
import './index.less'
import {useRef,useState,useEffect} from 'react'
import classNames from 'classnames';
import {AppGetInsuranceAlarmPushState} from '../../../../models'
import { withRouter } from 'next/router';
import store from '../rudex'
const warnSet=function Home({router}){
    const [onOff,setonOff]=useState(0);
    const [onOffStatic,setonOffStatic]=useState(0);
    const policyNumber=store.getState().InsuranceNo;
    const warnName=router.query.Name;
    const checkout=useRef();
    function tip(){
        if(checkout.current.checked){
            setonOff(0);
            setonOffStatic(1);
            appGetInsuranceAlarmPushState({InsuranceNo:policyNumber,Name:warnName,State:onOffStatic}).then((res)=>{
                console.log(onOffStatic);
                console.log(res);
            }).catch((err)=>{
                console.log(err);
            })
        }else{
            setonOff(1)
        }
    }
    function cancel(){
        setonOff(2);
        setonOffStatic(1);
        checkout.current.checked=true;
        appGetInsuranceAlarmPushState({InsuranceNo:policyNumber,Name:warnName,State:onOffStatic}).then((res)=>{
            console.log(onOffStatic);
            console.log(res);
        }).catch((err)=>{
            console.log(err);
        })
    }
    function affirm(){
        setonOff(2);
        setonOffStatic(2);
        checkout.current.checked=false;
        appGetInsuranceAlarmPushState({InsuranceNo:policyNumber,Name:warnName,State:onOffStatic}).then((res)=>{
            console.log(onOffStatic);
            console.log(res);
        }).catch((err)=>{
            console.log(err);
        })
    }
    let appGetInsuranceAlarmPushState=async(InsuranceNo,Name)=>{
        try{
            return await AppGetInsuranceAlarmPushState(InsuranceNo,Name)
        }catch(e){
            console.log(e);
        }
    }
    let AppSetInsuranceAlarmPushState=async(InsuranceNo,Name,State)=>{
        try{
            return await AppSetInsuranceAlarmPushState(InsuranceNo,Name,State)
        }catch(e){
            console.log(e);
        }
    }
    useEffect(()=>{
        appGetInsuranceAlarmPushState({InsuranceNo:policyNumber,Name:warnName}).then((res)=>{
            setonOffStatic(res.State);
            console.log(res);
            console.log(policyNumber);
        }).catch((err)=>{
            console.log(err);
        })
    },[]);
    return(
        <div className="warnSet">
            <Head>
            <title>腾讯连连</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name="viewport" content="width=width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
            </Head> 
            <main>
                <div className='setSwitch'>
                    <div className='setTitle'>电流过大警告</div>
                    <input type='checkbox' onClick={tip} ref={checkout} defaultChecked={onOffStatic==1?true:false} ></input>
                </div>
            </main>
            <footer className='shadow' className={classNames('shadow', {
                shadowOnOff:onOff==1
              })}>
                <div className='shadowTip'>
                    <div className='shadowTitle'>提示</div>
                    <div className='shadowText'>关闭后您将无法即使获取预警消息，确认关闭吗?</div>
                    <div className='shadowSwitch'>
                        <div className='cancel' onClick={cancel}>取消</div>
                        <div className='affirm' onClick={affirm}>确认</div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
export default withRouter(warnSet);