import axios from "axios";
import * as types from "../types";

export const fetchSettings = () => async (dispatch) => {
    const res = await axios.get("https://starnavi-frontend-test-task.herokuapp.com/game-settings");
    dispatch({
        type: types.GET_SETTINGS,
        payload: res.data,
    });
};

export const fetchWinners = () => async (dispatch) => {
    const res = await axios.get("https://starnavi-frontend-test-task.herokuapp.com/winners");
    dispatch({
        type: types.GET_WINNERS,
        payload: res.data
    })
}