import React, { useContext } from "react";
import { DataContext } from "../../store/GlobalState";
import { ratingApi } from "../../helpers/ratingFetcher";
import { ACTIONS } from "../../store/Actions";
import {
  Container,
  WildCardWrapper,
  WildCard,
} from "./styles";
import {getPhenomenonUrl} from '../../helpers/contentCard'
import * as tokens from "@sangre-fp/css-framework/tokens/fp-design-tokens"
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
    <Container>
      <WildCardWrapper 
        className='left' 
        data-href={getPhenomenonUrl(radar?.id, phenomenon)}
      >
        <WildCard
          className= {`left icon-issue ${iconClassName}`}
          backgroundColor={backgroundColor}
        >
          {phenomenon?.content?.title}
        </WildCard>
      </WildCardWrapper>
      {
        canBeEditAndClearResults && (
          <a onClick={onVisibilityHandler}>
        <span className=" af-custom-eye" style={{fontSize: '1.3em', color: tokens.ColorBlue, cursor: 'pointer'}}/>
      </a>
        )
      }
    </Container>
  );
};

export default HiddenResult;
