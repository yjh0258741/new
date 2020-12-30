export default function date(time){
    let date=new Date(time);
    let year = date.getFullYear(); 
    let month=date.getMonth();
    let day=date.getDate();
    let hour=date.getHours();
    
    let minutes=date.getMinutes();
    let getsecond=date.getSeconds();
    if(day<10){
        day="0"+day
    }
    if(hour<10){
        hour="0"+hour
    }
    if(minutes<10){
        minutes="0"+minutes
    }
    if(getsecond<10){
        getsecond="0"+getsecond
    }
    
    let str=year+'-'+month+1+'-'+day+' '+hour+':'+minutes+':'+getsecond;
    return str;
};