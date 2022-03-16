import {  ISBLACKTHEME } from "./ActionTypes";

const initialState = {
   isBlackTheme:false
  
}
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