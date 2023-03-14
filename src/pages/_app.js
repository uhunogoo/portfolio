import '../assets/index.css';
import '../assets/reset.css';

import React from 'react';
import Head from 'next/head'
import localFont from 'next/font/local'
import EnterProvider from '../components/Providers/EnterProvider';
import LoadingProvider from '../components/Providers/LoadingProvider';
import PreloadedContentProvider from '../components/Providers/PreloadedContentProvider';
import MenuProvider from '../components/Providers/MenuProvider';

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
            <MenuProvider>
              <Component {...pageProps} className={ applyedClass }/>
            </MenuProvider>
          </EnterProvider>
        </PreloadedContentProvider>
      </LoadingProvider>
    </>
  );
}

export default MyApp;