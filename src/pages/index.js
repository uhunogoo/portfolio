import React from 'react';
import Preload from '../components/Preload/Preload';
const WebglPart = React.lazy(() => import('../components/WebglPart/WebglPart') );

export default function Index() {
  return (
    <>
      <Preload />
      <WebglPart />
    </>
  );
}
