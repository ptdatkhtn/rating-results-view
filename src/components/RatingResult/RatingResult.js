import React, { useContext, useEffect } from "react";
import { DataContext } from "../../store/GlobalState";
import {
  RatingWidget,
  RatingItemHeader,
  RatingItem,
  RatingSlider,
  RatingHeader,
  IconToggleVisibilityWrapper,
  IconToggleVisibility,
  RatingSliderScale,
  SliderScaleMin,
  SliderScaleMax,
  SingleRating
} from "./styles";
import { ratingApi } from "../../helpers/ratingFetcher";
import { ACTIONS } from "../../store/Actions";

export const nodes = [
  {
    left: 10
  },
  {
    left: 20
  },
  {
    left: 30
  },
  {
    left: 40
  },
  {
    left: 100   
  },
  {
    left: 50   
  }
]

const Rating = ({ phenomenon, radar, isRatingX }) => { 
  const {
    state: { hiddenPhenomena },
    dispatch,
  } = useContext(DataContext);

  let symbolPhenomenon = ''
  let symbolBorderPhenomenon = ''
  let symbolBoxShadowPhenomenon = ''
  if(phenomenon?.['content-type-alias'] === 'rising'){
    symbolPhenomenon= 'rgb(0, 202, 141)'
    symbolBorderPhenomenon= 'transparent'
    symbolBoxShadowPhenomenon='transparent'
  } 
  else if(phenomenon?.['content-type-alias'] === 'weaksignal'){
    symbolPhenomenon= 'rgb(168, 168, 168)'
    symbolBorderPhenomenon= 'transparent'
    symbolBoxShadowPhenomenon='transparent'
  }
  else if (phenomenon?.['content-type-alias'] === 'summary'){
    symbolPhenomenon= 'rgb(0, 202, 141)'
    symbolBorderPhenomenon= 'rgb(0, 202, 141)'
    symbolBoxShadowPhenomenon='#fff'
  }
  else if (phenomenon?.['content-type-alias'] === 'cooling'){
    symbolPhenomenon= 'rgb(0, 152, 255)'
    symbolBorderPhenomenon= 'transparent'
    symbolBoxShadowPhenomenon='transparent'
  }
  else if (phenomenon?.['content-type-alias'] === 'wildcard'){
    symbolPhenomenon= 'rgb(233, 87, 87)'
    symbolBorderPhenomenon= 'transparent'
    symbolBoxShadowPhenomenon='transparent'
  }
  else {
    symbolPhenomenon= 'transparent'
    symbolBorderPhenomenon='rgb(0, 202, 141)'
    symbolBoxShadowPhenomenon='transparent'
  }

  const onVisibilityHandler = async () => {
    try {
      const hiddenPhenomenaUpdated = hiddenPhenomena?.concat(phenomenon?.id);
      await dispatch({
        type: ACTIONS.HIDDENPHENOMENA,
        payload: hiddenPhenomenaUpdated,
      });
      const payload = {
        [`rating/${radar?.group?.id}/radar/${radar?.id}`]: {
          hidden: hiddenPhenomenaUpdated,
        },
    };
    await ratingApi.addHiddenPhenomenaRatings(radar.group.id, radar.id, payload);
    } catch (error) {
      await dispatch({
        type: ACTIONS.ERROR,
        payload: {error},
      });
    }
  }

  console.log('eeppp', phenomenon)
  return (
    phenomenon && (
      <RatingWidget>
        <RatingHeader>
          <RatingItemHeader symbol={symbolPhenomenon} symbolBorder={symbolBorderPhenomenon} symbolBoxShadow={symbolBoxShadowPhenomenon}>{phenomenon?.content?.title}</RatingItemHeader>
          <IconToggleVisibilityWrapper onClick={onVisibilityHandler}>
            <IconToggleVisibility></IconToggleVisibility>
          </IconToggleVisibilityWrapper>
        </RatingHeader>
        <RatingItem>
          <RatingSliderScale>
              <SliderScaleMin>{isRatingX? radar?.axisXMin : radar?.axisYMin}</SliderScaleMin>
              <SliderScaleMax>{isRatingX? radar?.axisXMax : radar?.axisYMax}</SliderScaleMax>
            </RatingSliderScale>
          <RatingSlider
            className="inactive"
            type="range"
            min="1"
            max="100"
            value={isRatingX? phenomenon?.rating_x?.avg: phenomenon?.rating_y?.avg }
            disabled={true}
          >
          </RatingSlider>
          <div style={{position:'relative', width:'100%'}}>
            
            {
              ((isRatingX ? 
                (phenomenon?.rating_x?.values && !!phenomenon?.rating_x?.values?.length && phenomenon?.rating_x?.values)
                : (phenomenon?.rating_y?.values && !!phenomenon?.rating_y?.values?.length && phenomenon?.rating_y?.values)) || [])?.map(
                     /* eslint-disable */
                  rating => <SingleRating left={rating}/>
                  
              )
            }
          </div>      
        </RatingItem>
      </RatingWidget>
    )
  );
};

export default Rating;
