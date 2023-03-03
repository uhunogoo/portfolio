import React from 'react';

export const EnterContext = React.createContext();

function EnterProvider({ children }) {
    const [ enterStatus, setEnterStatus ] = React.useState( false );
    
    const value = React.useMemo(() => {
        return {
            enterStatus, 
            setEnterStatus,
        }
    }, [ enterStatus ]);

    return (
        <EnterContext.Provider value={ value }>
            { children }
        </EnterContext.Provider>
    );
}

export default EnterProvider;