import React, {useEffect} from 'react';
import {connect, useDispatch} from "react-redux";

import {fetchWinners} from '../../actions/actions';

import './WinnerPage.scss';

const WinnersPage = ({winners}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchWinners());
    }, [])

    return (
        <div className='winners'>
            <div className='winners_inner'>
                <h2 className="winners_title">Leader Board</h2>
                <ul className="winners_list">
                    { winners ? winners.map( (w, idx) => <li key={w.winner+idx} className="winners_list_el">
                        <p className="winners_list_el_name">{w.winner}</p>
                        <p className="winners_list_el_data">{w.date}</p>
                    </li>)
                    : <div>Loading...</div>}
                </ul>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    winners: state.winners.winners,
})

export default connect(mapStateToProps)(WinnersPage)