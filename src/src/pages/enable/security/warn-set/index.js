import Head from 'next/head'
import './index.less'
export default function Home(){
    return(
        <div className="warn-set">
            <Head>
            <title>腾讯连连</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name="viewport" content="width=width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
            </Head> 
            <main>
                <div className='set-switch'>
                    <div><img src='/images/downarrow'/></div>
                    <div className='set-title'>电流过大警告</div>
                    <div className='switch'></div>
                </div>
            </main>
        </div>
    )
}