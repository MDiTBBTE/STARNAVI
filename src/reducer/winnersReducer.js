import * as types from "../types";

export const winnersReducer = (state = [], action) => {
    switch (action.type) {
        case types.GET_WINNERS:
            return {
                ...state,
                winners: action.payload,
            };
        default:
            return state;
    }
};
