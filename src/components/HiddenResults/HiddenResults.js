import React from 'react'

import HiddenResult from '../HiddenResult/HiddenResult'
import {
    Container,
    HiddenResultsWrapper
} from './styles'

const HiddenResults = ({phenomena}) => {
    return (
        <Container>
            <h3>Hidden phenomena</h3>
            <p style={{width: '100%'}}>You can toggle the visibility of a phenomenon for other users by pressing the eye icon.</p>
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