import React from 'react';
import { TextureLoader } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { PreloadedContext } from '../components/PreloadedContentProvider/PreloadedContentProvider';
import sources from './sources';

export function useResources( setLoadingProgress ) {
  if (sources.length === 0) return;
  const { setPreloadedContent } = React.useContext( PreloadedContext );
  const totalCount = sources.length;
  const [items, setItems] = React.useState([]);

  const loaders = React.useMemo(() => {
    const textureLoader = new TextureLoader();

    const dracoLoader = new DRACOLoader();
    const gltfLoader = new GLTFLoader();
    dracoLoader.setDecoderPath('/draco/');
    gltfLoader.setDRACOLoader(dracoLoader);

    return {
      textureLoader,
      gltfLoader,
    };
  }, []);
  
  // Start loading
  React.useEffect(() => {
    const intervalId = window.setTimeout(() => {
      sources.map((source) => {
        manageLoading( source, loaders, setItems )
      });
    }, 200);
    
    // When I'm ready to stop the interval, I'd run:
    return () => {
      window.clearTimeout(intervalId);
    };
    
  }, [ loaders ]);

  React.useEffect(() => {
    setLoadingProgress( ( items.length / totalCount ) * 100 );
    
    if (items.length === totalCount) {
      setPreloadedContent( items );
    }
  }, [ setLoadingProgress, items ])
  
  if ( items.length !== totalCount ) return [];

}

async function manageLoading( source, loaders, setItems ) {
  let response;
  
  if (source.type === 'texture') {
    response = await loaders.textureLoader.loadAsync( source.path );
  } else if (source.type === 'gltfLoader') {
    response = await loaders.gltfLoader.loadAsync( source.path );
  }

  if (!response) return;
  const newItem = {
    name: source.name,
    item: response
  };
  setItems( currentItems => {
    const isExist = currentItems?.find(el => 
      el.name === newItem.name 
    ); 

    if ( isExist ) return [...currentItems ]; 
    return [...currentItems, newItem];
  });
}
