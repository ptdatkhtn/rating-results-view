import React, {useContext} from 'react'
import { requestTranslation } from '@sangre-fp/i18n'
import HiddenResult from '../HiddenResult/HiddenResult'
import {DataContext} from '../../store/GlobalState'
import {
    Container,
    HiddenResultsWrapper
} from './styles'

const HiddenResults = ({phenomena}) => {
    const { state: { radar } } = useContext(DataContext)

    return (
        <Container>
            <h3>{((radar?.radarLanguage === "en" ? 'Hidden phenomena' : 'Piilotetut ilmiöt' )) || requestTranslation('hiddenPhenomena_RatingResults')}</h3>
            <p style={{width: '100%'}}>{ (radar?.radarLanguage === "en" ? 'You can toggle the visibility of a phenomenon for other users by pressing the eye icon.' : 'Voit vaihtaa ilmiön näkyvyyttä muille käyttäjille painamalla silmäkuvaketta.') ||requestTranslation('hiddenPhenomenaDescription_RatingResults')}</p>
            <HiddenResultsWrapper>
                {
                    !!phenomena?.length && phenomena?.map ((phenomenon) => {
                        return (
                            <HiddenResult key={phenomenon?.id} phenomenon= {phenomenon}/>
                        )
                    })
                }
               
            </HiddenResultsWrapper>
           
        </Container>
        
    )
}

export default HiddenResults