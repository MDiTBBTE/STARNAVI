import {combineReducers} from "redux";
import {settingsReducer} from "./settingsReducer";
import {winnersReducer} from "./winnersReducer";

export default combineReducers({
    settings: settingsReducer,
    winners: winnersReducer
});
