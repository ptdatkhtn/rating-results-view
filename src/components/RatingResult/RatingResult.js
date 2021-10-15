import React, { useContext } from "react";
import { DataContext } from "../../store/GlobalState";
import {
  RatingWidget,
  RatingItemHeader,
  RatingItem,
  RatingSlider,
  RatingHeader,
  RatingSliderScale,
  SliderScaleMin,
  SliderScaleMax,
  SingleRating,
  SingleRatingCurrentUser
} from "./styles";
import {getPhenomenonUrl} from '../../helpers/contentCard'
import { ratingApi } from "../../helpers/ratingFetcher";
import { ACTIONS } from "../../store/Actions";
import * as tokens from "@sangre-fp/css-framework/tokens/fp-design-tokens"
import Slider from '../Slider'


const Rating = ({ phenomenon, radar, isRatingX }) => { 
  const {
    state: { hiddenPhenomena },
    dispatch,
  } = useContext(DataContext);

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

  let iconClassName = ''
  let backgroundColor = ''
  if(String(phenomenon?.['color']) === 'none'){
    if(phenomenon?.['content-type-alias'] === 'rising'){
      iconClassName = 'rising'
    } 
    else if(phenomenon?.['content-type-alias'] === 'weaksignal'){
      iconClassName = 'weaksignal'
    }
    else if (phenomenon?.['content-type-alias'] === 'summary'){
      iconClassName = 'summary'
    }
    else if (phenomenon?.['content-type-alias'] === 'cooling'){
      iconClassName = 'cooling'
    }
    else if (phenomenon?.['content-type-alias'] === 'wildcard'){
      iconClassName = 'wildcard'
    }
    else {
      iconClassName = 'undefined'
    }
  } else {
    iconClassName = 'undefined'
    backgroundColor = phenomenon?.['color']
  }

  const canBeEditAndClearResults = String(radar?.account?.role) !== 'visitor' && String(radar?.account?.role) !== 'user'

  return (
    phenomenon && (
      <RatingWidget >
        <RatingHeader>
          <RatingItemHeader 
            className= {`left icon-issue ${iconClassName}`}
            data-href={getPhenomenonUrl(radar?.id, phenomenon)}
            backgroundColor={backgroundColor}
          >
            {phenomenon?.content?.short_title || phenomenon?.content?.title}
          </RatingItemHeader>
          {
            canBeEditAndClearResults && (
              <a onClick={onVisibilityHandler}>
              <span className=" af-custom-eye-blocked" style={{fontSize: '1.3em', color: tokens.ColorBlue, cursor: 'pointer'}}/>
            </a>
            )
          }
        </RatingHeader>
        <RatingItem>
          <RatingSliderScale>
              <SliderScaleMin>{isRatingX? radar?.axisXMin : radar?.axisYMin}</SliderScaleMin>
              <SliderScaleMax>{isRatingX? radar?.axisXMax : radar?.axisYMax}</SliderScaleMax>
            </RatingSliderScale>
          {/* <RatingSlider
            className="inactive"
            type="range"
            min="1"
            max="100"
            value={isRatingX? phenomenon?.rating_x?.avg: phenomenon?.rating_y?.avg }
            disabled={true}
          >
          </RatingSlider> */}
          <Slider 
            value={isRatingX? phenomenon?.rating_x?.avg: phenomenon?.rating_y?.avg }
          />
          <div style={{position:'relative', width:'100%'}}>
            
            {
              ((isRatingX ? 
                (phenomenon?.rating_x?.values && !!phenomenon?.rating_x?.values?.length && phenomenon?.rating_x?.values)
                : (phenomenon?.rating_y?.values && !!phenomenon?.rating_y?.values?.length && phenomenon?.rating_y?.values)) || [])?.map(
                     /* eslint-disable */
                  rating => {
                    return <SingleRating leftValue={rating}/>
                  }
                  
              )
            }
            <SingleRatingCurrentUser leftValue={isRatingX ? phenomenon?.ratingCurrentX: phenomenon?.ratingCurrentY} isRated={!!phenomenon?.ratingCurrentX || !!phenomenon?.ratingCurrentX}/>
            
          </div>      
        </RatingItem>
      </RatingWidget>
    )
  );
};

export default Rating;
