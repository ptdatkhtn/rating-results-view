import styled from "styled-components/macro";
import {InfoCircle} from '@styled-icons/boxicons-regular'

export const RateTabWrapper = styled.div`
    background-color: #e8ebeb;
    width: 100%;
    height: 100%;
    position: relative;
    // margin-top: -45px;
`

export const RateTabFooter = styled.div`
  margin: 40px 0 30px 0;
  font-size: 13px;
  border-top: 1px solid #c4c4c4;
  padding-top: 20px;
`

export const ClearRatingsBtn = styled.a`

`

export const HeaderWrapper = styled.div`
  display: flex;
  margin-bottom: 26px;
  justify-content: space-between
`
export const InformationIcon = styled(InfoCircle)`
    color: #666;
    width: 18px;
    height: 18px;
    margin-top: 8px;
    margin-left: 18px;
    &:hover {
        cursor: pointer;
        color: #64cdef;
    }
`
export const HoverBox = styled.p`
    display: flex;
    flex-wrap: wrap;
    width: fit-content;
    justify-content: center;
    align-items: center;
    align-content: center;
    margin: auto; 
`

export const ShareBtn = styled.a`
    width: 86px;
    height: 32px;
`