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
import InformationModal from '../InformationModal/InformationModal'
import Popover from '@material-ui/core/Popover';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import {
  RateTabWrapper,
  RateTabFooter,
  ClearRatingsBtn,
  InformationIcon,
  HeaderWrapper,
  HoverBox,
  ShareBtn
} from "./styles"

const useStyles = makeStyles(theme => ({
  popover: {
    pointerEvents: 'none',
    width: '40%'
  },
  paper: {
    padding: theme.spacing(1),
    backgroundColor: '#424242',
    color: '#fff',
    width: 'fit-content'
  },
  
}));


const RatingResultsView = () => {
  const { state: {phenomenaData, radar, hiddenPhenomena, isFlip }, dispatch } = useContext(DataContext)

  const [openConfirmModal, setOpenConfirmModal]= useState(false)
  const [ratingDescriptionDisplayed, setRatingDescriptionDisplayed] = useState(false)
  const [ratingAnchorEl, setRatingAnchorEl] = useState(null);
  const [openRatingInformationModal, setOpenRatingInformationModal] = useState(false)
  const ratingPdf = React.useRef(null)
  const onHoverRatingIcon = (event) => {
    setRatingAnchorEl(event.currentTarget)
    setRatingDescriptionDisplayed(true)
}

  const onLeaveRatingIcon = () => {
    setRatingAnchorEl(null)
    setRatingDescriptionDisplayed(false)
  }

  const openRatingInformationModalHandle = () => {
    setOpenRatingInformationModal(true)
}

const closeRatingInformationModalHandle = () => {
    setOpenRatingInformationModal(false)
} 
  const classes = useStyles()
  let phenomenaFlip = [];
  if ( !!phenomenaData?.length && isFlip) {
    /* eslint-enable */
    phenomenaData.map((p) => {
      const rating_x = p && p['rating_y']
      const rating_y = p && p['rating_x']
      const ratingCurrentX = p && p['ratingCurrentY']
      const ratingCurrentY = p && p['ratingCurrentX']
      const phenCLone = {...p}
      phenCLone['rating_x'] = rating_x
      phenCLone['rating_y'] = rating_y
      phenCLone['ratingCurrentX'] = ratingCurrentX
      phenCLone['ratingCurrentY'] = ratingCurrentY

      phenomenaFlip.push(phenCLone)
    })
  } else {
    phenomenaFlip = phenomenaData
  }

  // workaround before finding the solution
  // phenomenaFlip = phenomenaData

  const inVisiblePhenonmena = useMemo(() => {
    return phenomenaFlip ? phenomenaFlip?.filter(phenomenon => hiddenPhenomena?.includes(phenomenon?.id)) : []
  }, [phenomenaData, hiddenPhenomena])
  const visiblePhenonmena = useMemo(() => {
    return phenomenaFlip ? phenomenaFlip.filter(phenomenon => !hiddenPhenomena?.includes(phenomenon?.id)) : []
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
      : 900
      )
  }

  React.useEffect(() => {
    calcSizeRateTabWrapper()
    return () => {
      window.removeEventListener('resize', calcSizeRateTabWrapper)
    }
  }, [])

  try {
    window.addEventListener('resize', function () {
      // clearTimeOut() resets the setTimeOut() timer
      // due to this the function in setTimeout() is 
      // fired after we are done resizing
      clearTimeout(eventTimeoutRef.current)
  
      // setTimeout returns the numeric ID which is used by
      // clearTimeOut to reset the timer
      eventTimeoutRef.current = setTimeout(calcSizeRateTabWrapper, 200);
    }, false)
  } catch (error) {
  }

  const canBeEditAndClearResults = String(radar?.account?.role) !== 'visitor' && String(radar?.account?.role) !== 'user'

  return (
    <RateTabWrapper ref={ratingPdf}>
      <HeaderWrapper>
        <div style={{display: 'flex'}}>
          <h2>{(radar?.radarLanguage === "en" ? 'Rating results' : 'Arvioinnin tulokset') || requestTranslation('RatingResultsTitle')}</h2>
          <InformationIcon 
              // background={false}
              onMouseEnter={onHoverRatingIcon} 
              onMouseLeave={onLeaveRatingIcon}
              onClick={openRatingInformationModalHandle}
          />
          <Popover 
            className={classes.popover}
            classes={{
                paper: classes.paper,
            }}
            open={ratingDescriptionDisplayed || false}
            anchorEl={ratingAnchorEl} 
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
            }}
            onClose={onLeaveRatingIcon}
            disableRestoreFocus
          >
            <HoverBox>{(radar?.radarLanguage === "en" ? '"More information on Rating"' : '"Lisätietoja arvioinnista"') || requestTranslation('InfoIconHoverRating')}</HoverBox>
          </Popover> 
          <InformationModal 
              radar={radar}
              InfoModalHeader={(radar?.radarLanguage === "en" ? 'Rating tool' : 'Arviointi') || requestTranslation('RatingTool')}
              InfoModalNote={(radar?.radarLanguage === "en" ? 'The Rating tool enables evaluation and assessment of the content on the radar via two axis, and displays the results in a fourfold table.' : 'Arviointityökalu mahdollistaa sisällön arvioinnin kahdella akselilla visualisoiden arvioinnin tulokset nelikentässä.') || requestTranslation('InfoModalRatingNote')}
              InfoModalOpen={openRatingInformationModal}
              InfoModalClose={closeRatingInformationModalHandle}
              LearnMoreBtn={requestTranslation('LearnMoreRatingBtn')}
              GuideBtn={requestTranslation('GuideRatingBtn')}
              LearnMoreLink='https://info.futuresplatform.com/hub/how-to-rate'
              GuideLink='https://info.futuresplatform.com/hub/most-commonly-used-axis-for-rating'
              InfoModalDescription={(radar?.radarLanguage === "en" ? 'After activating the Rating tool, anyone with access to the radar can rate on the content cards.' : 'Aktivoituasi arvioinnin kaikki, joilla on pääsy kartalle, voivat arvioida ennakointikartalla olevaa sisältöä.') || requestTranslation('InfoModalRatingContent')}
              InfoModalDescription2={(radar?.radarLanguage === "en" ? 'Activating Rating tool activates two "axis sliders" on each content card.' : 'Arvioinnissa jokaiselle sisältökortille ilmestyy kaksi liukusäädintä.') || requestTranslation('InfoModalRatingContent2')}
              InfoModalDescription3={(radar?.radarLanguage === "en" ? 'Access some of the most commonly used axis from the dropdown menu, and/or fill in custom axis names manually.' : 'Voit hyödyntää pudostusvalikosta löytyviä usein käytettyjä akseleita ja/tai voit nimetä akselit vapaasti itse.') || requestTranslation('InfoModalRatingContent3')}
              InfoModalDescription4={(radar?.radarLanguage === "en" ? 'After the rating activity, results can be found by clicking the centre of the radar.' : 'Arvioinnin jälkeen löydät arvioinnin tulokset painamalla kartan keskustaa.') || requestTranslation('InfoModalRatingContent4')}
              InfoModalDescription5={(radar?.radarLanguage === "en" ? 'A summary of ratings can be exported from the results view.' : ' Arviointi-sivulta voit ladata arviointien yhteenvedon jatkohyödyntämistä varten.') || requestTranslation('InfoModalRatingContent5')}
              InfoModalDescription6={(radar?.radarLanguage === "en" ? 'Remember to Save your settings after you have made changes. If you wish to discard the changes you made, click Cancel.' : 'Muistathan tallentaa tekemäsi valinnat. Mikäli haluat poistua tallentamatta, paina Peruuta.') || requestTranslation('InfoModalRatingContent6')}
          />
        </div>
        <ShareBtn className="btn btn-outline-secondary btn-sm" onClick={() => window.print()}><span className="af-custom-share" />{(radar?.radarLanguage === "en" ? 'SHARE' : 'JAA')}</ShareBtn>
      </HeaderWrapper>
      {
        width > 0 && radar && visiblePhenonmena.length > 0 &&
        <FourfoldTable 
          phenomena={visiblePhenonmena} 
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
      {visiblePhenonmena.length > 0 && radar && (
        <RatingResults phenomena={visiblePhenonmena} radar={radar} isFlip={isFlip}/>
      )}
      {inVisiblePhenonmena.length > 0 && (
        <HiddenResults phenomena={inVisiblePhenonmena} isFlip ={isFlip}/>
      )}
      <>
        { canBeEditAndClearResults && 
          (<>
            <RateTabFooter>
              <ClearRatingsBtn onClick={openConfirmModalHandler} className="btn btn-outline-secondary btn-sm">
                <span className="af-custom-close" />{ radar?.radarLanguage === "en" ? 'Clear Ratings' : 'Tyhjennä arviot' || requestTranslation('ClearRatings_RatingResults')}
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
