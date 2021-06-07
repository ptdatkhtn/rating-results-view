import styled from "styled-components/macro";
import * as tokens from "@sangre-fp/css-framework/tokens/fp-design-tokens"

export const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  position: relative;
  // align-items: center;

`
export const WildCardWrapper = styled.div`
  width: 100%;
  :hover {
    cursor:pointer;
  }
`

export const WildCard = styled.h4`
  font-size: ${tokens.H4FontSize};
  min-height: 25px;
  padding-left: 26px;
  width: 99%;
  word-wrap: break-word;
  // width: 410px;
  // white-space: nowrap;
  // overflow: hidden;
  // text-overflow: ellipsis;

  &:before {
    position: absolute;
    left: 0;
    top: 4px;
    background:${props => props.backgroundColor} !important;
  }
`

