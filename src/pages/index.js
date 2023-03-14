import React from 'react';
import ModalBlock from '../components/Modal/Modal';
import Preload from '../components/Preload/Preload';
import UILayer from '../components/UILayer/UILayer';
const WebglPart = React.lazy(() => import('../components/WebglPart/WebglPart') );

export default function Index() {
  return (
    <>
      <Preload />
      <UILayer />
      <ModalBlock/>
      <React.Suspense fallback={null}>
        <WebglPart />
      </React.Suspense>
    </>
  );
}
