import * as types from "../types";

export const settingsReducer = (state = [], action) => {
    switch (action.type) {
        case types.GET_SETTINGS:
            return {
                ...state,
                settings: action.payload,
            };
        default:
            return state;
    }
};
