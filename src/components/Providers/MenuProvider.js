import React from 'react';

export const MenuContext = React.createContext();

function MenuProvider({ children }) {
  const [menu, setMenu] = React.useState('default');

  const value = React.useMemo(() => {
    return {
      menu,
      setMenu,
    };
  }, [menu]);

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
}

export default MenuProvider;
