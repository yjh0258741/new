export default function letter (str, len){
    if(str.length>len){
        return str.substring(0,len)+"..."
    }
    return str;

}