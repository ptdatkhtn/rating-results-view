import styled from "styled-components/macro";

export const RateTabWrapper = styled.div`
    background-color: #e8ebeb;
    // padding-left: 8px;
    // padding-right: 8px;
    width: 100%
    height: 100%
`

export const RateTabFooter = styled.div`
  margin: 40px 0 30px 0;
  font-size: 13px;
  border-top: 1px solid #c4c4c4;
  padding-top: 20px;
`

export const ClearRatingsBtn = styled.a`
  margin: auto 0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  color: #006998;
  border: 1px solid #006998;
  width: 148px;
  border-radius: 20px;
  padding: 0 12px
`

export const CloseIcon = styled.div`
  &:after {
    display: inline-block;
    content: '\\d7';
    font-size: 22px;
  }
`

export const IconName = styled.div`
    font-weight: 700;
    font-size: 12px;
    margin: auto 0;
    padding-top: 3px;
`