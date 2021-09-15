import { ACTIONS } from "./Actions";

const reducers = (state, action) => {
    switch (action.type) {
        case ACTIONS.ERROR:
            return {
                ...state,
                error: action.payload
            }
        case ACTIONS.PHENOMENONDATA:
            return {
                ...state,
                phenomenaData: action.payload
            }
        case ACTIONS.RADAR:
            return {
                ...state,
                radar: action.payload
            }
        case ACTIONS.HIDDENPHENOMENA:
            return {
                ...state,
                hiddenPhenomena: action.payload
            }

        case ACTIONS.ISFLIP:
            return {
                ...state,
                isFlip: action.payload
            }
        default:
            return state
        }



}

export default reducers