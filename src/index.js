import React from 'react';
import ReactDOM from 'react-dom';
import {DataProvider} from "./store/GlobalState";
import RatingResultsView from './components/RatingResultsView/RatingResultsView';
import './scss/global-styles.scss';
import './translations'
import { startSession } from '@sangre-fp/connectors/session'
import './index.css'
import { GlobalStyles } from '@sangre-fp/ui'
import { RatingResultsStyles } from './styles'
//http://localhost:3010/?node=194688
const renderApp = (nid) => {
    return (
        <React.StrictMode>
            <DataProvider node={nid}>
                <GlobalStyles />
                <RatingResultsStyles />
                <RatingResultsView/>
            </DataProvider>
        </React.StrictMode>
    )
}

startSession().then(() => {
    const appElements = document.getElementsByClassName('rating-results-app')

    const defaultRadarId = (/node=\d+/.test(document.location.href) && document.location.href.replace(/^.*node=(\d+).*$/, '$1')) || null

    for (let el of appElements) {
        ReactDOM.render(
            renderApp(
                el.hasAttribute('data-radar-id') ? el.getAttribute('data-radar-id') : defaultRadarId,
            ),
            el
        )
    }
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
