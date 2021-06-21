import React from 'react'
import { requestTranslation } from '@sangre-fp/i18n'
import HiddenResult from '../HiddenResult/HiddenResult'
import {
    Container,
    HiddenResultsWrapper
} from './styles'

const HiddenResults = ({phenomena}) => {
    return (
        <Container>
            <h3>{requestTranslation('hiddenPhenomena_RatingResults')}</h3>
            <p style={{width: '100%'}}>{requestTranslation('hiddenPhenomenaDescription_RatingResults')}</p>
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