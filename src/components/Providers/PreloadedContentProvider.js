import React from 'react';

export const PreloadedContext = React.createContext();

function PreloadedContentProvider({ children }) {
  const [ preloadedContent, setPreloadedContent ] = React.useState([]);

  const value = React.useMemo(() => {
    return {
      preloadedContent,
      setPreloadedContent,
    };
  }, [preloadedContent]);

  return (
    <PreloadedContext.Provider value={value}>
      {children}
    </PreloadedContext.Provider>
  );
}

export default PreloadedContentProvider;
