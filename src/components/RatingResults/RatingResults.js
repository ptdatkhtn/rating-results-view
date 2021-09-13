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
      const ratingsCurrentUser = await ratingApi.getRatingsCurrentUserOnly1Api(radar?.group.id, radar?.id)

      /* eslint-disable */
      /* eslint-disable */
      Object.entries(ratingsCurrentUser?.data).filter( rating => {
        const currentPhenId = rating[0]?.split('/')[5]
        SortedPhenomenaX?.map((pheX) => {
          if (String(currentPhenId) === String(pheX?.id)) {
            // console.log('pheX', pheX)
            if (String(rating[0]?.split('/')[6]) === 'x') {
              pheX['ratingCurrentX'] = rating[1]?.percentage
            } else if (String(rating[0]?.split('/')[6]) === 'y') {
              pheX['ratingCurrentY'] = rating[1]?.percentage
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
