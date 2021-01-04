import { createStore } from 'redux';
function Reducer(state={InsuranceNo:'1'},action){
    switch(action.type){
        case 'val': return Object.assign({},state,{InsuranceNo:action.value});
        default : return state
    }
}
const store=createStore(Reducer);

export default store