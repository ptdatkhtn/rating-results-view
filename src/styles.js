import { createGlobalStyle } from 'styled-components'

export const RatingResultsStyles = createGlobalStyle` 
   

  .af-custom-fullscreen_exit:before {
    content: "";
}

.af-custom-fullscreen:before {
    content: "";
}

.af-custom-fullscreen {
  &:hover {
    color: #006998 !important;
  }
}

.af-custom-fullscreen_exit {
  &:hover {
    color: #006998 !important;
  }
}

.btn-fullscreen-custom {
  position: absolute;
  right: 23px;
  bottom: 18px;
  color: #fff;
  z-index: 10;
  // padding: .5rem;
  font-size: 2rem;
  line-height: 1;
  background-color: transparent;
  transition: opacity 200ms ease-in-out;
  width: 32px;
  height: 32px;

  &:hover {
    color: #006998 !important;
  }
}

.btn-fullscreen-custom:before {
    display: block;
    content: "";
    font-family: 'af-custom' !important;
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    font-size: 32px;
}

.btn-fullscreen-custom-exit {
  position: absolute;
  right: 23px;
  bottom: 18px;
  color: #fff;
  z-index: 10;
  // padding: .5rem;
  font-size: 2rem;
  line-height: 1;
  background-color: transparent;
  transition: opacity 200ms ease-in-out;
  width: 32px;
  height: 32px;

  &:hover {
    color: #006998 !important;
  }
}
.btn-fullscreen-custom-exit:before {
  display: block;
  content: "";
  font-family: 'af-custom' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  font-size: 32px;
}
`