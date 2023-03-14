import React from 'react';

export const LoadingProgressContext = React.createContext();

function LoadingProvider({ children }) {
  const [loadingProgress, setLoadingProgress] = React.useState(null);

  const value = React.useMemo(() => {
    return {
      loadingProgress,
      setLoadingProgress,
    };
  }, [loadingProgress]);

  return (
    <LoadingProgressContext.Provider value={value}>
      {children}
    </LoadingProgressContext.Provider>
  );
}

export default LoadingProvider;
