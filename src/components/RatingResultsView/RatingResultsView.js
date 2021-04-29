import React, {useContext, useState} from "react";
import {DataContext} from '../../store/GlobalState'
import RatingResults from "../RatingResults/RatingResults";
import HiddenResults from "../HiddenResults/HiddenResults";
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal'
import { ratingApi } from '../../helpers/ratingFetcher';
import { ACTIONS } from '../../store/Actions'
import FourfoldTable from '../FourfoldTable'
import {
  RateTabWrapper,
  RateTabFooter,
  ClearRatingsBtn,
  CloseIcon,
  IconName
} from "./styles";
const RatingResultsView = () => {
  const { state: {phenomenaData, radar, hiddenPhenomena }, dispatch } = useContext(DataContext)
  const [openConfirmModal, setOpenConfirmModal]= useState(false)
  let visiblePhenonmena = []
  let inVisiblePhenonmena = []

  inVisiblePhenonmena = phenomenaData?.filter(phenomenon => hiddenPhenomena?.includes(phenomenon?.id))
  visiblePhenonmena = phenomenaData?.filter(phenomenon => !hiddenPhenomena?.includes(phenomenon?.id))
  const openConfirmModalHandler = () => {
    setOpenConfirmModal(true)
  } 

  const closeConfirmModalHandler = () => {
    setOpenConfirmModal(false)
  } 

  const onClearRatesHandler = async () => {
    setOpenConfirmModal(false)    
    radar && await ratingApi.deleteAllRatings(radar.group.id, radar.id).then(async (data) => {
      dispatch({
        type: ACTIONS.PHENOMENONDATA,
        payload: []
      })
      dispatch({
        type: ACTIONS.HIDDENPHENOMENA,
        payload: []
      })
      const payload = {
        [`rating/${radar.group.id}/radar/${radar.id}`]: {
          hidden: [],
        },
      };
      radar && await ratingApi.addHiddenPhenomenaRatings(radar.group.id, radar.id, payload)
    }) 
  }

  const getElFromVoteTab = document.getElementsByClassName('voting-results-container')[0]
 
  const stageCanvasRef = React.useRef(null);
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)

  const calcSizeRateTabWrapper = React.useCallback(() => {
    setHeight(
      Number(2* stageCanvasRef?.current?.offsetWidth/3) > 0 
      ? Number(2* stageCanvasRef?.current?.offsetWidth/3)
      : (getElFromVoteTab?.hasAttribute('data-radar-id') 
          && getElFromVoteTab?.getAttribute('data-radar-id') === radar?.id 
          && getElFromVoteTab?.offsetWidth > 0)
          ? getElFromVoteTab?.offsetWidth *2/3
          : 0)

    setWidth(Number(stageCanvasRef?.current?.offsetWidth *9/10) > 0 
    ? Number(9* stageCanvasRef?.current?.offsetWidth/10)
    : (getElFromVoteTab?.hasAttribute('data-radar-id') 
        && getElFromVoteTab?.getAttribute('data-radar-id') === radar?.id 
        && getElFromVoteTab?.offsetWidth > 0)
        ? getElFromVoteTab?.offsetWidth *9/10
        : 0)
  }, [setHeight, setWidth, stageCanvasRef])

  React.useEffect(() => {
    calcSizeRateTabWrapper()
    return () => {
      window.removeEventListener('resize', calcSizeRateTabWrapper)
    }
  }, [calcSizeRateTabWrapper, height, width, stageCanvasRef])

  window.addEventListener('resize', calcSizeRateTabWrapper, false)

  return (
    <RateTabWrapper ref={stageCanvasRef}>
      {
        stageCanvasRef?.current?.offsetWidth > 0 &&
        <FourfoldTable 
          phenomena={visiblePhenonmena || []} 
          containerWidth={width -120} 
          containerHeight={height - 120}
          axisLabel3={radar?.fourFieldsBottomLeft} 
          axisLabel4={radar?.fourFieldsBottomRight} 
          axisLabel5={radar?.fourFieldsTopLeft} 
          axisLabel6={radar?.fourFieldsTopRight} 
          axisLabel1={radar?.axisXTitle}
          axisLabel1a={radar?.axisXMin}
          axisLabel1b={radar?.axisXMax}
          axisLabel2={radar?.axisYTitle}
          axisLabel2a={radar?.axisYMin}
          axisLabel2b={radar?.axisYMax}
        />
      }
      <RatingResults phenomena={visiblePhenonmena || []} radar={radar}/>
      <HiddenResults phenomena={inVisiblePhenonmena || []}/>
      <RateTabFooter>
        <ClearRatingsBtn onClick={openConfirmModalHandler}>
          <CloseIcon></CloseIcon>
          <IconName>CLEAR RATINGS</IconName>
        </ClearRatingsBtn>
      </RateTabFooter>
      <ConfirmationModal confirmationModal={openConfirmModal} confirmationModalClose={closeConfirmModalHandler} clearRatings={onClearRatesHandler}/>
    </RateTabWrapper>
  );
};

export default RatingResultsView;
