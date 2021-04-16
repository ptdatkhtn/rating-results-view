import styled from 'styled-components'

export const modalStyles = {
    content: {
        display: 'block',
        background: '#fff',
        color: '#000',
        opacity: 1,
        width: '55%',
        height: 'auto',
        maxWidth: '900px',
        borderRadius: '0',
        margin: '0 auto',
        position: 'relative',
        top: 'auto',
        left: 'auto',
        right: 'auto',
        bottom: 'auto',
        padding: '50px 0',
        overflow: 'visible',
        border: 'none',
        marginTop: '56px'
    },
    overlay: {
        backgroundColor: 'rgba(19, 19, 19, 0.8)',
        overflowX: 'hidden',
        overflowY: 'auto',
        padding: '0',
        top: '0',
        left: '0',
        bottom: 'auto',
        right: 'auto',
        width: '100%',
        height: '100%',
        zIndex: 999
    }
}

export const Btn = styled.button`
    border: none;
    outline: none;
    background: none;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;

    &:active {
        border: none;
    }
`

export const BtnGroup = styled.div`
    display: flex;
    justify-content: center;
`

export const ModalContent = styled.h5`
    display: flex;
    justify-content: center;
`