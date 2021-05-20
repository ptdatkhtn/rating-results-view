import React, { useContext } from "react";
import { DataContext } from "../../store/GlobalState";
import { ratingApi } from "../../helpers/ratingFetcher";
import { ACTIONS } from "../../store/Actions";
import {
  Container,
  WildCardWrapper,
  WildCard,
  IconToggleVisibility,
  IconToggleVisibilityWrapper,
} from "./styles";
import {getPhenomenonUrl} from '../../helpers/contentCard'

const HiddenResult = ({ phenomenon }) => {
  const {
    state: { hiddenPhenomena, radar },
    dispatch,
  } = useContext(DataContext);

  const onVisibilityHandler = async () => {
    try {
      const hiddenPhenomenaUpdated =
      !!hiddenPhenomena?.length &&
      hiddenPhenomena?.filter(
        (invisibilityPhenomenon) => phenomenon?.id !== invisibilityPhenomenon
      );

      await dispatch({
        type: ACTIONS.HIDDENPHENOMENA,
        payload: hiddenPhenomenaUpdated,
      });

      const payload = {
        [`voting/${radar.group.id}/radar/${radar.id}`]: {
          hidden: hiddenPhenomenaUpdated,
        },
      };
      await ratingApi.addHiddenPhenomenaRatings(
        radar.group.id,
        radar.id,
        payload
      );
    } catch (error) {
      await dispatch({
        type: ACTIONS.ERROR,
        payload: {error},
      });
    }
  };
  
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
  
  return (
    <Container>
      <WildCardWrapper className='left' data-href={getPhenomenonUrl(radar?.id, phenomenon)}>
        <WildCard
          symbol={symbolPhenomenon}
          symbolBorder={symbolBorderPhenomenon}
          symbolBoxShadow={symbolBoxShadowPhenomenon}
        >
          {phenomenon?.content?.title}
        </WildCard>
      </WildCardWrapper>
      <IconToggleVisibilityWrapper onClick={onVisibilityHandler}>
        {/* <IconToggleVisibility></IconToggleVisibility> */}
        <span className=" af-custom-eye" style={{fontSize: '1.3em', color: '#006998', cursor: 'pointer'}}/>
      </IconToggleVisibilityWrapper>
    </Container>
  );
};

export default HiddenResult;
