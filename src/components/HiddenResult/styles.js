import styled from "styled-components/macro";
import {Eye} from '@styled-icons/bootstrap'
export const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  position: relative;
  align-items: center;

`
export const WildCardWrapper = styled.div`
  :hover {
    cursor:pointer;
  }
`
export const IconToggleVisibility= styled(Eye)`
  color: #006998;
  font-weight: 500;
  cursor: pointer;
  font-size: 15px;
  display: flex;
  justify-content: flex-end;
  position: relative;
  right: 0;
`
export const IconToggleVisibilityWrapper= styled.div `
  width: 21px;
  height: 15px;
  position: absolute;
  right: 0;
`
export const WildCard = styled.h4`
  display: block;
  position: relative;
  margin-bottom: 6px;
  font-weight: 700;
  font-size: 15px;
  line-height: 1.5;
  min-height: 25px;
  padding-left: 26px;
  padding-top: 0;

  &:before {
    background: ${props => props.symbol};
    border: 1px solid ${props => props.symbolBorder};
    box-shadow: inset 0px 0px 1px 1px ${props => props.symbolBoxShadow};
    display: block;
    position: absolute;
    left: 0;
    top: 4px;
    content: '';
    width: 16px;
    height: 16px;
    border-radius: 100%;
  }
`

