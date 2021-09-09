import React, {useEffect, useState} from "react";

import RatingResult from "../RatingResult/RatingResult";
import { Container, AxisName } from "./styles";
import { ratingApi } from "../../helpers/ratingFetcher";

export const currentUserRatings = {
  rating_x: 50,
  rating_y: 30
}

const RatingResults = ({phenomena, radar}) => {
  const SortedPhenomenaX = React.useMemo( () => phenomena || [], [phenomena]);

  const [phenonmenonListX, setphenonmenonListX] = useState(phenomena)


  useEffect(() => {
    const fetchRatingsCurrentUser = async () => {
      
      const ratingsCurrentUser = await Promise.all(
        phenomena?.map((phen) => {
          return ratingApi.getRatingsCurrentUser(radar?.group.id, radar?.id, phen?.id)
        })
      )
      
      console.log('testtttingggg.....')
      
      /* eslint-disable */
      /* eslint-disable */
      ratingsCurrentUser?.filter( rating => {
        const currentPhenId = Object.keys(rating?.data)[0]?.split('/')[5]

        SortedPhenomenaX?.map((pheX) => {
          if (String(currentPhenId) === String(pheX?.id)) {
            if (String(Object.keys(rating?.data)[0]?.split('/')[6]) === 'x') {
              pheX['ratingCurrentX'] = rating?.data[`/${radar?.group.id}/radar/${radar?.id}/phenomenon/${currentPhenId}/x`]
            } else if (String(Object.keys(rating?.data)[0]?.split('/')[6]) === 'y') {
              pheX['ratingCurrentY'] = rating?.data[`/${radar?.group.id}/radar/${radar?.id}/phenomenon/${currentPhenId}/y`]
            }

            if ((String(Object.keys(rating?.data)[1]?.split('/')[6]) === 'x')) {
              pheX['ratingCurrentX'] = rating?.data[`/${radar?.group.id}/radar/${radar?.id}/phenomenon/${currentPhenId}/x`]
            } else if ((String(Object.keys(rating?.data)[1]?.split('/')[6]) === 'y')) {
              pheX['ratingCurrentY'] = rating?.data[`/${radar?.group.id}/radar/${radar?.id}/phenomenon/${currentPhenId}/y`]
            }
          }
        })

        
      })

      setphenonmenonListX(SortedPhenomenaX)
    }

    fetchRatingsCurrentUser()
   
  }, [phenomena])

  return (
    <Container>
      <div style={{width: 'calc(50% - 12px)'}}>
        <AxisName>{radar?.axisXTitle}</AxisName>
        {
          phenonmenonListX
          ?.sort((a, b) => Number(b['rating_x'].avg) - Number(a['rating_x'].avg) )
          ?.map((phenomenon) => {
            return (
              <RatingResult phenomenon={phenomenon} key={phenomenon.id} isRatingX={true} radar={radar} currentUserRatings={phenomenon}/>
            )
          })
        }
      </div>
      <div style={{width: 'calc(50% - 12px)'}}>
        <AxisName>{radar?.axisYTitle}</AxisName>
        {
         phenonmenonListX
         ?.sort((a, b) => Number(b['rating_y'].avg) - Number(a['rating_y'].avg) )
         ?.map((phenomenon) => (
           <RatingResult phenomenon={phenomenon} key={phenomenon.id} isRatingX={false} radar={radar} currentUserRatings={phenomenon}/>
         ))
        }
      </div>
    </Container>
  );
};

export default RatingResults;
