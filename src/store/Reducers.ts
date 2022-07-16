import {
    ISBLACKTHEME,
    SET_CURRENT_ACCOUNT,
    SET_CURRENT_PRICE,
    SET_ENTRY_ROUTE, SET_WALLET_ROUTE,
    WALLET_ROUTE_ASSETS
} from "./ActionTypes";

export const getInitialState = () => {
    const state = {
        isBlackTheme: false,
        currentAccount: {},
        entryRoute: '',
        walletRoute: WALLET_ROUTE_ASSETS,
        currentPrice: {"usd": 0},
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
        case SET_CURRENT_PRICE: {
            return {
                ...state,
                currentPrice: action.currentPrice,
            };
        }
        case SET_WALLET_ROUTE: {
            return {
                ...state,
                walletRoute: action.walletRoute,
            };
        }

        default: {
            return state;
        }
    }
}
export default Reducers;
