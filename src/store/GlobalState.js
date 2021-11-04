import React, { createContext, useReducer, useEffect, useCallback } from 'react'
import reducers from './Reducers.js'
import { ACTIONS } from './Actions'
import { getRadar, getPhenomenaTypes } from '@sangre-fp/connectors/drupal-api';
import radarDataApi from '@sangre-fp/connectors/radar-data-api';
import {getPhenomena} from '../helpers/phenomenonFetcher'
import { ratingApi } from '../helpers/ratingFetcher';

const initialState = {
    phenomenaData: [],
    radar: {},
    error: {},
    hiddenPhenomena: [],
    isFlip: false
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
                const [getRadarDataApi, getRadarDrupalApi] = await Promise.all([
                    radarDataApi.getRadar(node).then(radar => {
                        /* eslint-disable */
                        Object.keys(radar?.data?.phenomena).map(async (pid) => {
                            phenomenaIds.push(radar?.data?.phenomena[pid]?.id)
                        })
                    }),
                    getRadar(node).then((radar) => {
                        dispatch({
                            type: ACTIONS.RADAR,
                            payload: radar
                        })

                        groups = groups.concat(radar?.group?.id)
                    })
                ])

                const page = 0
                const size = phenomenaIds?.length || 10
                const phenonmena = []

                const [allHiddenRatings, phenomenaList, phenomenaTypes, allRatings, isFlipRatings] = await Promise.all(
                    [
                        ratingApi.getAllHiddenRatings(groups[1] || 0, node)
                            .then(async (hiddenPhenomena) => {
                                dispatch({
                                    type: ACTIONS.HIDDENPHENOMENA,
                                    payload: hiddenPhenomena?.data[`rating/${groups[1] || 0}/radar/${node}`]?.hidden || []
                                })
                            })
                        ,
                        getPhenomena({'phenomena': phenomenaIds, undefined, groups: groups, page, size})
                        ,
                        getPhenomenaTypes(groups[1] || 0)
                        ,
                        ratingApi.getAllRatings(groups[1] || 0, node),
                        ratingApi.getFlipAxisAfterSaved(groups[1], node)
                    ]
                )
                // console.log('radar222', radar)
                {
                    isFlipRatings && dispatch({
                        type: ACTIONS.ISFLIP,
                        payload: isFlipRatings.data?.isFlip
                    })
                    /* eslint-disable */
                    phenomenaList?.result.map((phenonmenon) => {
                        /* eslint-disable */
                        phenomenaTypes?.map((type) => {
                            if (String(phenonmenon?.content?.type) === String(type?.id)) {
                                phenonmenon['content-type-alias'] = type.alias
                                phenonmenon['content-type-title'] = type.title
                                /* eslint-disable */
                                phenonmena?.push(phenonmenon)
                                if (String(phenonmenon?.content?.type).includes('fp:doc-types')) {
                                    const nameCustomType = String(phenonmenon?.content?.type).split('/')[3]
                                    phenonmenon['color'] = String(type?.style?.color)
                                } else {
                                    phenonmenon['color'] = 'none'
                                }
                            }
                        })
                    })
                    /* eslint-disable */
                    Object.keys(allRatings?.data)?.map(async (phe) => {
                        const pheId = phe.split('/')
                        /* eslint-disable */
                        !!phenonmena?.length && phenonmena?.forEach(phenomenon => {
                            if (String(phenomenon?.id) === String(pheId[5]) && String(pheId[6]) === 'x') {
                                phenomenon['rating_x'] = allRatings?.data[phe]
                            }
                            if (String(phenomenon?.id) === String(pheId[5]) && String(pheId[6]) === 'y') {
                                phenomenon['rating_y'] = allRatings?.data[phe]
                            }
                        })
                    })

                    dispatch({
                        type: ACTIONS.PHENOMENONDATA,
                        payload: phenonmena.filter((p) => p.hasOwnProperty('rating_x') && p.hasOwnProperty('rating_y'))
                    })
                }

                return []

            } catch (error) {
                // mock data
                // const nodes = [
                //     {
                //       id: 1,
                //       'content-type-alias': 'cooling',
                //       content: {
                //         short_title: 'short_title1111'
                //       } ,
                //       rating_x: {
                //         median: 40,
                //         avg: 20
                //       },
                //       rating_y: {
                //         median: 38,
                //         avg: 68
                //       }
                //     },
                //     {
                //       id: 2,
                //       'content-type-alias': 'cooling',
                //       content: {
                //         short_title: 'short_title222222'
                //       } ,
                //       rating_x: {
                //         median: 20,
                //         avg: 30
                //       },
                //       rating_y: {
                //         median: 58,
                //         avg: 78
                //       }
                //     }
                //   ]
                //   dispatch({
                //     type: ACTIONS.PHENOMENONDATA,
                //     payload: nodes
                // })

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

