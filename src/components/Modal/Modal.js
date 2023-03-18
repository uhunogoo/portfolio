import React from 'react';
import styles from '../../assets/modal.module.css';

import { MenuContext } from '../Providers/MenuProvider';
import { ModalContext } from '../Providers/ModalProvider';
import { PreloadedContext } from '../Providers/PreloadedContentProvider';

import AboutMe from '../AboutMe/AboutMe';
import CloseButton from './CloseButton.js';
import MyProjects from '../MyProjects/MyProjects';

function Modal({ modalStatus, setModalStatus, children }) {
  
  const { preloadedContent } = React.useContext( PreloadedContext );
  const { setMenu } = React.useContext( MenuContext );

  const audio = React.useMemo(() => {
    return preloadedContent?.find(
      el => el.name === 'close'
    );
  }, [ preloadedContent ]);

  return <>
  { modalStatus &&
    <div className={ styles.point__content }>
      <CloseButton 
        clearAnimation={ () => {
          setModalStatus(false);
        } }
        clickAnimation={ () => {
          audio.item.play();
          setMenu('default');
        } }
      />
      { children }
    </div>
  }
  </>;
}

function ModalBlock() {
  const { menu } = React.useContext( MenuContext );
  const { modalStatus, setModalStatus } = React.useContext( ModalContext );
  const [ openedMenu, setOpenedMenu ] = React.useState( false );

  React.useEffect(() => {
  }, []);
  React.useEffect(() => {
    if (menu !== 'default') {
      setOpenedMenu( menu );
    } else {
      const timeout = window.setTimeout(() => {
        setOpenedMenu( false );
      }, 1000);
      
      return () => {
        window.clearTimeout( timeout );
      }
    }
  }, [ menu ]);

  return (
    <Modal 
      modalStatus={ modalStatus } 
      setModalStatus={ setModalStatus } 
    >
      
      { openedMenu === 'works' && <MyProjects /> }
      { openedMenu === 'about' && <AboutMe /> }
    </Modal>
  );
}

export default React.memo( ModalBlock );
