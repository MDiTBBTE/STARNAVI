import React, {Suspense} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

const GameBoardPage = React.lazy(() => import('../pages/GameBoardPage'));
const WinnersPage = React.lazy(() => import('../pages/WinnerPage'));

const MainRouter = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route exact path="/" component={GameBoardPage}/>
                    <Route exact path="/winners" component={WinnersPage}/>
                </Switch>
            </Suspense>
        </BrowserRouter>
    );
}

export default MainRouter;


