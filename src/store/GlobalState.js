import React, { createContext, useReducer, useEffect, useCallback } from 'react'
import reducers from './Reducers.js'
import { startSession } from '../helpers/session';
import { ACTIONS } from './Actions'
import { getRadar, getPhenomenaTypes } from '@sangre-fp/connectors/drupal-api';
import {getPhenomena} from '../helpers/phenomenonFetcher'
import { ratingApi } from '../helpers/ratingFetcher';

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
            await getRadar(node).then ((radar) => {
                dispatch({
                    type: ACTIONS.RADAR,
                    payload: radar
                })

/*                radar.axisXMax
                radar.axisXMin
                radar.axisXTitle
                radar.axisYMax
                radar.axisYMin
                radar.axisYTitle
                radar.fourFieldsBottomLeft
                radar.fourFieldsBottomRight
                radar.fourFieldsTopLeft
                radar.fourFieldsTopRight*/

                groups = groups.concat(radar?.group?.id)
                /* eslint-disable */
                Object.keys(radar?.phenomena).map(async (pid) => {
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
                    /* eslint-disable */
                    data?.result.map((phenonmenon) => {
                        /* eslint-disable */
                        types?.map((type) => {
                            if (String(phenonmenon?.content?.type) === String(type?.id)) {
                                phenonmenon['content-type-alias'] = type.alias
                                phenonmenon['content-type-title'] = type.title
                                /* eslint-disable */
                                phenonmena?.push(phenonmenon)
                            }
                        })
                    })
                    // fetch all ratings for all phenomenon
                    await ratingApi.getAllRatings(groups[1], node).then(
                        async ({data}) => {
                            /* eslint-disable */
                            Object.keys(data)?.map( async(phe) => {
                                const pheId = phe.split('/')
                                /* eslint-disable */
                                !!phenonmena?.length && phenonmena?.forEach(phenomenon => { 
                                    if(String(phenomenon?.id) === String(pheId[5]) && String(pheId[6]) === 'x') {
                                        phenomenon['rating_x'] = data[phe]
                                    }
                                    if(String(phenomenon?.id) === String(pheId[5]) && String(pheId[6]) === 'y') {
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
                // mock data
                const nodes = [
                    {
                      id: 1,
                      'content-type-alias': 'cooling',
                      content: {
                        short_title: 'short_title1111'
                      } ,
                      rating_x: {
                        median: 40,
                        avg: 20
                      },
                      rating_y: {
                        median: 38,
                        avg: 68
                      }
                    },
                    {
                      id: 2,
                      'content-type-alias': 'cooling',
                      content: {
                        short_title: 'short_title222222'
                      } ,
                      rating_x: {
                        median: 20,
                        avg: 30
                      },
                      rating_y: {
                        median: 58,
                        avg: 78
                      }
                    }
                  ]
                  dispatch({
                    type: ACTIONS.PHENOMENONDATA,
                    payload: nodes
                })
                
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
        /* eslint-disable */
        <>
            <DataContext.Provider value={{state, dispatch}}>
                {children}
            </DataContext.Provider>
        </>
    )
}

