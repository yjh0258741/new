import './index.less'
export default function reset(props){
    const callback=props;
    function www(){
        console.log(callback.resetClick());
    }
    return (<div >
        <div className='resetClick' onClick={www}>
            网络不佳，请刷新
        </div>
    </div>)
}