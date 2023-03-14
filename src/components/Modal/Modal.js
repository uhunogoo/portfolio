import React from 'react';
import styles from '../../assets/modal.module.css';

import { MenuContext } from '../Providers/MenuProvider';
import { ModalContext } from '../Providers/ModalProvider';
import { PreloadedContext } from '../Providers/PreloadedContentProvider';

import AboutMe from '../AboutMe/AboutMe';
import CloseButton from './CloseButton.js';
import Works from '../Works/Works';

function Modal({ children }) {
  
  const { setMenu } = React.useContext( MenuContext );
  const { preloadedContent } = React.useContext( PreloadedContext );
  const { modalStatus, setModalStatus } = React.useContext( ModalContext );

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
  return (
    <Modal>
      <AboutMe />
      <Works />
    </Modal>
  );
}

export default React.memo( ModalBlock );
