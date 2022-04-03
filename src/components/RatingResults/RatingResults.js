import React, {useContext, useEffect, useState} from "react";

import RatingResult from "../RatingResult/RatingResult";
import { Container, AxisName } from "./styles";
import { ratingApi } from "../../helpers/ratingFetcher";
// import { requestTranslation } from '@sangre-fp/i18n'
// import HiddenResult from '../HiddenResult/HiddenResult'
import {DataContext} from '../../store/GlobalState'

export const currentUserRatings = {
  rating_x: 50,
  rating_y: 30
}

const RatingResults = ({phenomena, radar, isFlip}) => {
  const [ratingsCurrentUser, setRatingsCurrentUser] = useState([])

  const { state: { keyAvgMedian } } = useContext(DataContext)
  console.log('keyAvgMediankeyAvgMedian', keyAvgMedian)
  const SortedPhenomenaX = React.useMemo( () => {
    let sortedPhena = phenomena
    /* eslint-disable */
    ratingsCurrentUser.data && Object.entries(ratingsCurrentUser?.data).map( rating => {
      const currentPhenId = rating[0]?.split('/')[5]
      /* eslint-disable */
      sortedPhena.length > 0 && sortedPhena.map((pheX) => {
        if (String(currentPhenId) === String(pheX?.id)) {
          if (!isFlip) {
            if (String(rating[0]?.split('/')[6]) === 'x') {
              pheX['ratingCurrentX'] = rating[1]?.percentage
            } else if (String(rating[0]?.split('/')[6]) === 'y') {
              pheX['ratingCurrentY'] = rating[1]?.percentage
            }
          } else {
            if (String(rating[0]?.split('/')[6]) === 'x') {
              pheX['ratingCurrentY'] = rating[1]?.percentage
            } else if (String(rating[0]?.split('/')[6]) === 'y') {
              pheX['ratingCurrentX'] = rating[1]?.percentage
            }
          }

          // // workaround before finding the solution
          // if (String(rating[0]?.split('/')[6]) === 'x') {
          //       pheX['ratingCurrentX'] = rating[1]?.percentage
          // } else if (String(rating[0]?.split('/')[6]) === 'y') {
          //       pheX['ratingCurrentY'] = rating[1]?.percentage
          // }
        }
      })
    })
    return sortedPhena
  }, [ratingsCurrentUser]);

  const xSortedPhenomena = React.useMemo( () => SortedPhenomenaX.length > 0 && [...SortedPhenomenaX]
    ?.sort((a, b) => 
      (keyAvgMedian === 1 ? Number(b['rating_x'].avg) : Number(b['rating_x'].median))
        - ((keyAvgMedian === 1 ? Number(a['rating_x'].avg) : Number(a['rating_x'].median)))
        ), 
        [SortedPhenomenaX, keyAvgMedian])
  const ySortedPhenomena = React.useMemo( () => SortedPhenomenaX.length > 0 && [...SortedPhenomenaX]
    ?.sort((a, b) => (keyAvgMedian === 1 ? Number(b['rating_y'].avg) : Number(b['rating_y'].median)) - (keyAvgMedian === 1 ? Number(a['rating_y'].avg) : Number(a['rating_y'].median)) )
    , [SortedPhenomenaX, keyAvgMedian])

  useEffect(() => {
    const fetchRatingsCurrentUser = async () => {
      const ratingsCurrentUserFetch = await ratingApi.getRatingsCurrentUserOnly1Api(radar?.group.id, radar?.id)
      setRatingsCurrentUser(ratingsCurrentUserFetch)
    }

    !!phenomena.length && fetchRatingsCurrentUser()
   
  }, [phenomena])

  return (
    <Container>
      <div style={{width: 'calc(50% - 12px)'}}>
        <AxisName>{radar?.axisXTitle}</AxisName>
        {
          xSortedPhenomena.length > 0 && xSortedPhenomena?.map((phenomenon) => {
            return (
              phenomenon && <RatingResult phenomenon={phenomenon} key={phenomenon.id} isRatingX={true} radar={radar}/>
            )
          })
        }
      </div>
      <div style={{width: 'calc(50% - 12px)'}}>
        <AxisName>{radar?.axisYTitle}</AxisName>
        {
         ySortedPhenomena.length > 0 && ySortedPhenomena
         ?.map((phenomenon) => (
          phenomenon && <RatingResult phenomenon={phenomenon} key={phenomenon.id} isRatingX={false} radar={radar}/>
         ))
        }
      </div>
    </Container>
  );
};

export default RatingResults;
