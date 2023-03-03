import '../assets/index.css';
import '../assets/reset.css';

import React from 'react';
import Head from 'next/head'
import localFont from 'next/font/local'
import EnterProvider from '../components/EnterProvider/EnterProvider';
import LoadingProvider from '../components/LoadingProvider/LoadingProvider';
import PreloadedContentProvider from '../components/PreloadedContentProvider/PreloadedContentProvider';

// Include custom fonts 
const Romanica = localFont({ src: '../../public/fonts/Romanica/Romanica.woff2' });

function MyApp({ Component, pageProps }) {
  const applyedClass= Romanica.className;

  return (
    <>
      <Head>
        <meta name="description" content="Yurii Scherbachenko Three.js portfolio page" />
        <title>Yurii</title>
      </Head>
      <LoadingProvider>
        <PreloadedContentProvider>
          <EnterProvider>
              <Component {...pageProps} className={ applyedClass }/>
          </EnterProvider>
        </PreloadedContentProvider>
      </LoadingProvider>
    </>
  );
}

export default MyApp;