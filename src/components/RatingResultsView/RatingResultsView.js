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
import { makeStyles, 
  // createStyles, 
  // Theme 
} from '@material-ui/core/styles';

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
            <HoverBox>{(radar?.radarLanguage === "en" ? 'More information on Rating results view' : 'Lis???? tietoa arvioinnin tulosn??kym??st??') || requestTranslation('InfoIconHoverRating')}</HoverBox>
          </Popover> 
          <InformationModal 
              radar={radar}
              InfoModalHeader={(radar?.radarLanguage === "en" ? 'Rating results' : 'Arvioinnin tulokset') || requestTranslation('RatingTool')}
              InfoModalNote={(radar?.radarLanguage === "en" ? `The Rating results view consists of two main sections: the fourfold table that shows the results in 2-by-2 matrix, and two lists for both axes. You can review the content cards by clicking the dots / titles.
              ` : 'Arvioinnin tulosn??kym?? koostuu kahdesta osiosta: nelikent??st?? ja kumpaakin arviointiakselia vastaavasta listasta.') || requestTranslation('InfoModalRatingNote')}
              InfoModalNote2={(radar?.radarLanguage === "en" ? `The fourfold table:
              ` : 'Nelikentt??:') || requestTranslation('InfoModalRatingNote2')}
              InfoModalNote3={(radar?.radarLanguage === "en" ? `The lists:
              ` : 'Listat:') || requestTranslation('InfoModalRatingNote2')}
              InfoModalNote4={(radar?.radarLanguage === "en" ? `At the bottom of the view, for the facilitators, there is the list of hidden items and a possibility to clear all results.
              ` : 'N??kym??n alaosassa on fasilitaattoreille n??kyviss?? lista piilotetuista ilmi??ist?? sek?? mahdollisuus tyhjent???? arvioinnin tulokset.') || requestTranslation('InfoModalRatingNote2')}
              InfoModalNote4b={(radar?.radarLanguage === "en" ? `Note:
              ` : ' Huom: ') || requestTranslation('InfoModalRatingNote2')}
              InfoModalNote4c={(radar?.radarLanguage === "en" ? `Clearing the results can???t be undone, so please make sure you have exported the results as PPT Summary before clearing the rating score.
              ` : 'Arvioiden tyhjent??minen poistaa kaikki tehdyt arvioinnit, mink?? j??lkeen niit?? ei voi palauttaa. Varmistathan, ett?? olet sit?? ennen tallentanut ty??n tulokset esimerkiksi PPT-yhteenvedoksi.') || requestTranslation('InfoModalRatingNote2')}
              InfoModalOpen={openRatingInformationModal}
              InfoModalClose={closeRatingInformationModalHandle}
              LearnMoreBtn={requestTranslation('LearnMoreRatingBtn')}
              GuideBtn={requestTranslation('GuideRatingBtn')}
              LearnMoreLink='https://info.futuresplatform.com/hub/how-to-rate'
              GuideLink='https://info.futuresplatform.com/hub/most-commonly-used-axis-for-rating'
              InfoModalDescription={(radar?.radarLanguage === "en" ? 'Zooming is possible like in the radar screen (scroll with two fingers or with mouse)' 
                : 'N??kym???? voi zoomata kuten karttaa (hiirell?? tai kahdella sormella rullaamalla)') || requestTranslation('InfoModalRatingContent')}
              InfoModalDescription2={(radar?.radarLanguage === "en" ? 'Dots are placed based on the average/median values' 
                : 'Pallojen sijainti m????r??ytyy keskiarvon/ mediaanin mukaisesti') || requestTranslation('InfoModalRatingContent2')}
              InfoModalDescription3={(radar?.radarLanguage === "en" ? 'Absolute / dispersed mode: if the dots are placed on top of each other, the dispersed mode moves them slightly apart from each other' 
                : 'Tarkka / hajautettu sijoittelu: j??lkimm??isess?? p????llekk??in sijaitsevia sis??lt??j?? siirret????n hieman, jotta kaikki sis??ll??t tulevat n??kyviin') || requestTranslation('InfoModalRatingContent3')}
              InfoModalDescription4={(radar?.radarLanguage === "en" ? 'Hide title shows the matrix without Content titles' 
                : 'Halutessasi voit piilottaa otsikot') || requestTranslation('InfoModalRatingContent4')}
              InfoModalDescription5={(radar?.radarLanguage === "en" ? 'Resize -/+ changes the size of the titles and dots' 
                : 'Tekstin koko -/+ vaikuttaa nimen lis??ksi my??s pallon kokoon') || requestTranslation('InfoModalRatingContent5')}
              InfoModalDescription6={(radar?.radarLanguage === "en" ? 'Fullscreen button opens the matrix in presentation mode; to return to the normal view press the X button or ESC key' 
                : 'Voit avata n??kym??n koko ruudulle painamalla koko n??ytt?? -painiketta (full screen). Paluu tapahtuu joko n??kym??n oikeasta yl??kulmasta X:???? tai n??pp??imist??lt?? ESC-painiketta.') || requestTranslation('InfoModalRatingContent5')}

              InfoModalDescriptionb={(radar?.radarLanguage === "en" ? 'Sorted by average/median value (large dots)' 
                : 'Yhteenlasketun keskiarvon/mediaanin mukainen j??rjestys (isot pallot)') || requestTranslation('InfoModalRatingContent6')}
              InfoModalDescriptionb2={(radar?.radarLanguage === "en" ? 'Small dots are showing individual assessments' 
                : 'Pienet pallot ovat yksitt??isten k??ytt??jien arvioita') || requestTranslation('InfoModalRatingContent6')}
              InfoModalDescriptionb3={(radar?.radarLanguage === "en" ? 'Small blue dot represents your personal assessment' 
                : 'Pieni sininen pallo n??ytt???? oman arviosi') || requestTranslation('InfoModalRatingContent6')}
              InfoModalDescriptionb4={(radar?.radarLanguage === "en" ? 'Single content items can be hidden from the list by clicking the eye icon' 
                : 'Sis??lt??kortteja voidaan piilottaa listalta klikkaamalla silm??-ikonia') || requestTranslation('InfoModalRatingContent6')}
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
                <span className="af-custom-close" />{ radar?.radarLanguage === "en" ? 'Clear Ratings' : 'Tyhjenn?? arviot' || requestTranslation('ClearRatings_RatingResults')}
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
