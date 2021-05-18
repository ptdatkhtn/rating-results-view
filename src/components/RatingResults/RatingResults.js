import React from "react";

import RatingResult from "../RatingResult/RatingResult";
import { Container, AxisName } from "./styles";
const RatingResults = ({phenomena, radar}) => {
  const SortedPhenomenaX = !!phenomena?.length ? [].concat(phenomena) : [];
  const SortedPhenomenaY = !!phenomena?.length ? [].concat(phenomena) : [];
  
  return (
    <Container>
      <div style={{width: 'calc(50% - 12px)'}}>
        <AxisName>{radar?.axisXTitle}</AxisName>
        {
          SortedPhenomenaX
          .sort((a, b) => Number(b['rating_x'].avg) - Number(a['rating_x'].avg) )
          .map((phenomenon) => (
            <RatingResult phenomenon={phenomenon} key={phenomenon.id} isRatingX={true} radar={radar}/>
          ))
        }
      </div>
      <div style={{width: 'calc(50% - 12px)'}}>
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
