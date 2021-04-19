import { createContext, useReducer, useEffect, useCallback } from 'react'
import reducers from './Reducers.js'
import { startSession } from '../helpers/session';
import { ACTIONS } from './Actions'
import { getRadar, getPhenomenaTypes } from '@sangre-fp/connectors/drupal-api';
import {getPhenomena} from '../helpers/phenomenonFetcher'
import { ratingApi } from '../helpers/fetcher';

const initialState = {
    phenomenaData: [],
    radar: {},
    error: {},
    hiddenPhenomena: []
}

export const DataContext = createContext(initialState) 

export const DataProvider = ({children, node}) => {
    const [state, dispatch] = useReducer(reducers, initialState)
    const fetchPhenomenaDataInitTime = useCallback(
        async () => {
            try {
                let phenomenaIds = []
            let groups = [0]
            // node=194690
            await getRadar(node).then ((data) => {
                dispatch({
                    type: ACTIONS.RADAR,
                    payload: data
                })
                groups = groups.concat(data?.group?.id)
                Object.keys(data?.phenomena).map(async (pid) => {
                    phenomenaIds.push(pid)
                })
            })
              
            const page = 0
            const size = phenomenaIds?.length || 10
            const phenonmena = []
            await getPhenomena({ phenomenaIds, undefined, groups, page, size }).then(
                async (data) => 
                {
                    const types = await getPhenomenaTypes(groups[1])
                    data?.result.map((phenonmenon) => {
                        types?.map((type) => {
                            if (String(phenonmenon?.content?.type) === String(type?.id)) {
                                phenonmenon['content-type-alias'] = type.alias
                                phenonmenon['content-type-title'] = type.title
                                phenonmena?.push(phenonmenon)
                            }
                        })
                    })
                    // fetch all ratings for all phenomenon
                    await ratingApi.getAllRatings(groups[1], node).then(
                        async ({data}) => {
                            Object.keys(data)?.map( async(phe) => {
                                const pheId = phe.split('/')
                                !!phenonmena?.length && phenonmena?.forEach(phenomenon => { 
                                    if(phenomenon?.id === pheId[5] && pheId[6] ==='x') {
                                        phenomenon['rating_x'] = data[phe]
                                    }
                                    if(phenomenon?.id === pheId[5] && pheId[6] ==='y') {
                                        phenomenon['rating_y'] = data[phe]
                                    }
                                })
                            })  
                        }
                    )

                    await ratingApi.getAllHiddenRatings(groups[1], node)
                        .then(async (hiddenPhenomena) => {
                            dispatch({
                                type: ACTIONS.HIDDENPHENOMENA,
                                payload:  hiddenPhenomena?.data[`rating/${groups[1]}/radar/${node}`]?.hidden || []
                            })
                        })
                    dispatch({
                        type: ACTIONS.PHENOMENONDATA,
                        payload: phenonmena.filter((p) => p.hasOwnProperty('rating_x') && p.hasOwnProperty('rating_y'))
                    })
                }
                
            )
            return []

            } catch (error) {
                dispatch({
                    type: ACTIONS.ERROR,
                    payload: {error}
                })
            }
        },
        [dispatch],
    )

    useEffect(() => {
        try {
            (async () => {
                await startSession()
            })();
    
            fetchPhenomenaDataInitTime()
            dispatch({type: ACTIONS.ERROR, payload: {success: 'Start session is done'}})
        } catch (error) {
            dispatch({type: ACTIONS.ERROR, payload: {error}})
        }
    },[dispatch, fetchPhenomenaDataInitTime])

    return(
        <DataContext.Provider value={{state, dispatch}}>
            {children}
        </DataContext.Provider>
    )
}

