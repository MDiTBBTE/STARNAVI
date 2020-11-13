import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from "react-redux";
import _ from 'lodash';
import axios from "axios";
import {fetchSettings} from '../../actions/actions';

import './GameBoardPage.scss';

const GameBoardPage = ({settings, history}) => {
    const dispatch = useDispatch();
    //--- state
    const [seconds, setSeconds] = useState(0);
    const [secondsFall, setSecondsFall] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [winner, setWinner] = useState('')
    const [isPlay, setIsPlay] = useState(false);
    const [name, setName] = useState('');
    const [openSelector, setOpenSelector] = useState(false);
    const [gameMode, setGameMode] = useState({});
    const [gameBoard, setGameBoard] = useState([]);

    //--- game functions

    const handleSetGameMode = (mode) => setGameMode(settings[mode]);
    const handleSetOpenSelector = () => setOpenSelector(!openSelector);
    const handleSetName = (e) => setName(e.value);

    const autoCreateGameBoard = (amount) => {
        const multiplyAmount = amount * amount;
        const board = [];
        for (let i = 1; i <= multiplyAmount; i++) {
            board.push({id: i, color: ''});
        }

        setGameBoard(board);
    };

    const handlePlayGame = () => {
        setWinner('');
        setOpenSelector(false);

        const isName = name.length !== 0;
        const isLevel = Object.entries(gameMode).length !== 0;

        if (isLevel === true && isName === true) {
            setIsActive(true);
            setIsPlay(true);
        } else {
            alert('Please write your name and choose your level')
        }
    };
    const handlePlayAgainGame = () => {
        setSeconds(0);
        setIsActive(false);
        setIsPlay(false);

        setGameBoard([]);
        setGameMode({});
        setName('');

        setWinner('');
    };

    const handleChooseCell = (elem) => {
        let cells = gameBoard.map(e => {
            if (e.id === elem.id && e.color === '#44D8E7') {
                return {id: e.id, color: '#00E970'}
            }
            return e;
        });

        setGameBoard(cells)
    };
    const autoSelectElem = () => {

        const notColoredCells = _.filter(gameBoard, {color: ''});
        let randomElem = notColoredCells.length !== 0 && _.sample(notColoredCells);

        const s = gameBoard.map(e => {
            if (e.id === randomElem.id) {
                if (e.color === '#E85A5F' || e.color === '#00E970') {
                    return {id: e.id, color: e.color}
                }
                return {id: e.id, color: '#44D8E7'};
            }
            return e;
        });

        let userScore = _.filter(gameBoard, {color: '#00E970'}).length;
        if (notColoredCells.length < gameBoard.length * 0.5) {
            if (gameBoard.length * 0.5 < userScore) {
                autoSetWinner(name)
            } else {
                autoSetWinner("Computer");
            }
        }
        // gameBoard.length * 0.5 < userScore && autoSetWinner(name);
        // notColoredCells.length < gameBoard.length * 0.5 ? gameBoard.length * 0.5 < userScore && autoSetWinner("Computer");
        setGameBoard(s);

    };

    const autoSetWinner = (winnerName) => {
        setWinner(winnerName)
        setIsActive(false);

        const today = new Date();
        axios.post('https://starnavi-frontend-test-task.herokuapp.com/winners', {
            winner: winnerName,
            date: `
                ${today.toLocaleTimeString().substring(0, 5)}; 
                ${today.getDay()} ${today.toLocaleString('en-us', {month: 'long'})} ${today.getFullYear()}
            `
        })
            .catch(error => console.log(error));
    };

    //--- hooks
    useEffect(() => {
        let interval = null;

        if (isActive) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, gameMode.delay);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive]);

    useEffect(() => {
        let intervalFall = null;

        if (isActive) {
            intervalFall = setInterval(() => {
                setSecondsFall(secondsFall => secondsFall + 1)
            }, +gameMode.delay - 10);
        } else if (!isActive && secondsFall !== 0) {
            clearInterval(intervalFall);
        }

        return () => clearInterval(intervalFall);
    }, [isActive]);

    useEffect(() => {
        autoSelectElem()
    }, [seconds])

    useEffect(() => {
        const s = gameBoard.map(e => {
            if (e.color === '#44D8E7') {
                return {id: e.id, color: '#E85A5F'}
            }
            return e;
        });

        setGameBoard(s)
    }, [secondsFall])

    useEffect(() => {
        autoCreateGameBoard(+gameMode.field)
    }, [gameMode])

    useEffect(() => {
        dispatch(fetchSettings());
    }, [])

    return (
        <div className='game'>
            <div className='game_inner'>
                <div className="game_options">
                    <div className="game_options_selector" onClick={handleSetOpenSelector}>
                        Pick game mode
                        <div className="game_options_selector_opt">
                            {settings ? openSelector && Object.keys(settings).map((e, idx) => <div
                                key={e}
                                name={e}
                                onClick={() => handleSetGameMode(e)}
                                className="game_options_selector_el">{e}</div>)
                                : <div className="game_options_selector_el">Loading...</div>}
                        </div>
                    </div>
                    <input type="text" placeholder="Enter your name" className="game_options_input" value={name}
                           onChange={(e) => handleSetName(e.target)}/>
                    <button
                        className="game_options_btn"
                        onClick={isPlay ? handlePlayAgainGame : handlePlayGame}
                    >
                        {isPlay ? "PLAY AGAIN" : "PLAY"}
                    </button>
                    <button className='game_options_btn' onClick={() => history.push('/winners')}>see a winners board
                    </button>
                </div>

                {winner.length !== 0 &&
                <p className="game_msg">The winner is <span>{winner}</span>. Our congratulation!!!</p>}

                {gameBoard.length !== 0 &&
                <div className="game_square"
                     style={{gridTemplate: `repeat(${gameMode.field}, 1fr) / repeat(${gameMode.field}, 1fr)`}}>
                    {gameBoard.map((e, idx) => <div
                        key={idx} className="game_square_cell"
                        style={{background: `${e.color}`}}
                        onClick={() => handleChooseCell(e)}
                    />)}
                </div>
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    settings: state.settings.settings,
})

export default connect(mapStateToProps)(GameBoardPage)