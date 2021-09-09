import React, {useContext, useState, useMemo } from "react";
import {DataContext} from '../../store/GlobalState'
import RatingResults from "../RatingResults/RatingResults";
import HiddenResults from "../HiddenResults/HiddenResults";
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal'
import { ratingApi } from '../../helpers/ratingFetcher';
import { ACTIONS } from '../../store/Actions'
import FourfoldTable from '../FourfoldTable'
import {innerDimensions} from '../../helpers/dimension'
import { requestTranslation } from '@sangre-fp/i18n'
import {
  RateTabWrapper,
  RateTabFooter,
  ClearRatingsBtn,
} from "./styles"

const RatingResultsView = () => {
  const { state: {phenomenaData, radar, hiddenPhenomena }, dispatch } = useContext(DataContext)
  const [openConfirmModal, setOpenConfirmModal]= useState(false)

  const inVisiblePhenonmena = useMemo(() => {
    return phenomenaData ? phenomenaData?.filter(phenomenon => hiddenPhenomena?.includes(phenomenon?.id)) : []
  }, [phenomenaData, hiddenPhenomena])
  const visiblePhenonmena = useMemo(() => {
    return phenomenaData ? phenomenaData.filter(phenomenon => !hiddenPhenomena?.includes(phenomenon?.id)) : []
  }, [phenomenaData, hiddenPhenomena])
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

  const eventTimeoutRef = React.useRef(null)
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)

  const calcSizeRateTabWrapper = () => {
    const getTabContentElement = document.getElementsByClassName('tab-content')[0]

    setHeight(
      getTabContentElement? 
      (+(innerDimensions(getTabContentElement).width -60) * 0.56)
      : 800 * 0.56
      )
    setWidth(
      getTabContentElement?
      (innerDimensions(getTabContentElement).width -60)
      : 800
      )
  }

  React.useEffect(() => {
    calcSizeRateTabWrapper()
    return () => {
      window.removeEventListener('resize', calcSizeRateTabWrapper)
    }
  }, [])

  window.addEventListener('resize', function () {
    // clearTimeOut() resets the setTimeOut() timer
    // due to this the function in setTimeout() is 
    // fired after we are done resizing
    clearTimeout(eventTimeoutRef.current)

    // setTimeout returns the numeric ID which is used by
    // clearTimeOut to reset the timer
    eventTimeoutRef.current = setTimeout(calcSizeRateTabWrapper, 200);
  }, false)

  const canBeEditAndClearResults = String(radar?.account?.role) !== 'visitor' && String(radar?.account?.role) !== 'user'

  console.log('visiblePhenonmena', visiblePhenonmena)
  return (
    <RateTabWrapper>
      {
        width > 0 &&
        <FourfoldTable 
          phenomena={visiblePhenonmena || []} 
          containerWidth={width - 60} 
          containerHeight={height + 60}
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
          radar={radar}
        />
      }
      <RatingResults phenomena={visiblePhenonmena} radar={radar}/>
      <HiddenResults phenomena={inVisiblePhenonmena}/>
      <>
        { canBeEditAndClearResults && 
          (<>
            <RateTabFooter>
              <ClearRatingsBtn onClick={openConfirmModalHandler} className="btn btn-outline-secondary btn-sm">
                <span className="af-custom-close" />{requestTranslation('ClearRatings_RatingResults')}
              </ClearRatingsBtn>
            </RateTabFooter>
            <ConfirmationModal confirmationModal={openConfirmModal} confirmationModalClose={closeConfirmModalHandler} clearRatings={onClearRatesHandler}/>
          </>)
        }
      </>

    </RateTabWrapper>
  );
};

export default RatingResultsView;
