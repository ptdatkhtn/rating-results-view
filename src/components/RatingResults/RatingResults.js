import React from "react";

import RatingResult from "../RatingResult/RatingResult";
import { Container, AxisName } from "./styles";
const RatingResults = ({phenomena, radar}) => {
  const SortedPhenomenaX = !!phenomena?.length ? [].concat(phenomena) : [];
  const SortedPhenomenaY = !!phenomena?.length ? [].concat(phenomena) : [];

  const [ratingsPhenomenonX, setRatingsPhenomenonX] = React.useState([])
  const [ratingsPhenomenonY, setRatingsPhenomenonY] = React.useState([])
  let ratingsPhenomenonX2 = []
  let ratingsPhenomenonY2 = []
  useEffect(() => {
    try {
      (async () => {
        const ratingsPhenomenon = await ratingApi.getRatingByPhenomenonId(radar?.group?.id, radar?.id, phenomenon?.id)
        
        Object.keys(ratingsPhenomenon?.data).map(async (pid) => {
          // console.log('ratingsPhenomenon', ratingsPhenomenon[pid])
          const params = pid.split('/')
          // console.log('params', params)
          if (isRatingX && params[6] === 'x') {
            console.log('xxxx', ratingsPhenomenon?.data[pid])
            ratingsPhenomenonX2 = [...ratingsPhenomenonX2, ratingsPhenomenon?.data[pid]]
            
          } if (params[6] === 'y') {
            console.log('yyy', ratingsPhenomenon?.data[pid])
            ratingsPhenomenonY2.push([ratingsPhenomenon?.data[pid]])
          
          }
          
      })
      
        setRatingsPhenomenonX(ratingsPhenomenonX2)
    })();
    } catch (error) {
      
    }
    
  }, [])
  
  return (
    <Container>
      <div>
        <AxisName>{radar?.axisXTitle}</AxisName>
        {
          SortedPhenomenaX
          .sort((a, b) => Number(b['rating_x'].avg) - Number(a['rating_x'].avg) )
          .map((phenomenon) => (
            <RatingResult phenomenon={phenomenon} key={phenomenon.id} isRatingX={true} radar={radar}/>
          ))
        }
      </div>
      <div>
        <AxisName>{radar?.axisYTitle}</AxisName>
        {
         SortedPhenomenaY
         .sort((a, b) => Number(b['rating_y'].avg) - Number(a['rating_y'].avg) )
         .map((phenomenon) => (
           <RatingResult phenomenon={phenomenon} key={phenomenon.id} isRatingX={false} radar={radar}/>
         ))
        }
      </div>
    </Container>
  );
};

export default RatingResults;
