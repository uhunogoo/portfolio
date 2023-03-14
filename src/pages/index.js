import React from 'react';
import Preload from '../components/Preload/Preload';
import UILayer from '../components/UILayer/UILayer';
const WebglPart = React.lazy(() => import('../components/WebglPart/WebglPart') );

export default function Index() {
  return (
    <>
      <Preload />
      <UILayer />
      <React.Suspense fallback={null}>
        <WebglPart />
      </React.Suspense>
    </>
  );
}
