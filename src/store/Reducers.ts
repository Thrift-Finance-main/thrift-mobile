import {  ISBLACKTHEME } from "./ActionTypes";

export const getInitialState = () => {
    console.log('initConfig');
    let currentConfig = "";
    /*
    realmDb.getConfig().then(r =>{
        if (r.length){
            currentConfig = r[0]
        }
    });

     */
    const state = {
        isBlackTheme:false,
        currentAccount: currentConfig.currentAccount
    }
    return state;

};
const initialState = getInitialState();

const Reducers = (state = initialState, action:any) => {
    switch (action.type) {
        case ISBLACKTHEME: {
            return {
                ...state,
                isBlackTheme: action.isBlackTheme,
            };
        }

        default: {
            return state;
        }
    }
}
export default Reducers;
