import React from 'react';

export const ModalContext = React.createContext();

function ModalProvider({ children }) {
    const [ modalStatus, setModalStatus ] = React.useState( false );
    
    const value = React.useMemo(() => {
        return {
            modalStatus, 
            setModalStatus,
        }
    }, [ modalStatus ]);

    return (
        <ModalContext.Provider value={ value }>
            { children }
        </ModalContext.Provider>
    );
}

export default ModalProvider;