import {ISBLACKTHEME, SET_CURRENT_ACCOUNT, SET_ENTRY_ROUTE} from "./ActionTypes";

export const getInitialState = () => {
    const state = {
        isBlackTheme: false,
        currentAccount: {},
        entryRoute: ''
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
        case SET_ENTRY_ROUTE: {
            return {
                ...state,
                entryRoute: action.entryRoute,
            };
        }

        default: {
            return state;
        }
    }
}
export default Reducers;
