import {ISBLACKTHEME, SET_CURRENT_ACCOUNT} from "./ActionTypes";

export const getInitialState = () => {
    const state = {
        isBlackTheme: false,
        currentAccount: {}
    }
    return state;

};
const initialState = getInitialState();

const Reducers = (state = initialState, action:any) => {
    console.log('Reducer:');
    console.log(action.type);
    console.log(action);
    switch (action.type) {
        case ISBLACKTHEME: {
            return {
                ...state,
                isBlackTheme: action.isBlackTheme,
            };
        }
        case SET_CURRENT_ACCOUNT: {
            return {
                ...state,
                currentAccount: action.currentAccount,
            };
        }

        default: {
            return state;
        }
    }
}
export default Reducers;
