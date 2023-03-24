import '../assets/index.css';
import '../assets/reset.css';

import React from 'react';
import Head from 'next/head'
import localFont from 'next/font/local'
import EnterProvider from '../components/Providers/EnterProvider';
import LoadingProvider from '../components/Providers/LoadingProvider';
import PreloadedContentProvider from '../components/Providers/PreloadedContentProvider';
import MenuProvider from '../components/Providers/MenuProvider';
import ModalProvider from '../components/Providers/ModalProvider';

// Include custom fonts 
const Romanica = localFont({ src: '../../public/fonts/Romanica/Romanica.woff2' });

function MyApp({ Component, pageProps }) {
  const applyedClass= Romanica.className;

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" sizes="16x16" />
        <link rel="icon" href="/favicon-32.png" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png" />
        <meta name="description" content="Yurii Scherbachenko Three.js portfolio page" />
        <title>Yurii</title>
      </Head>
      <LoadingProvider>
        <PreloadedContentProvider>
          <EnterProvider>
            <MenuProvider>
              <ModalProvider>
                <Component {...pageProps} className={ applyedClass }/>
              </ModalProvider>
            </MenuProvider>
          </EnterProvider>
        </PreloadedContentProvider>
      </LoadingProvider>
    </>
  );
}

export default MyApp;