import { DefaultLoadingManager } from 'three'

import { Hud, OrthographicCamera } from '@react-three/drei'

import { useThree } from '@react-three/fiber'
import React, { useState, useCallback, Suspense, useEffect, createContext } from 'react'

import World from './World/World.jsx'
import EffectsLayout from './Effects.jsx'
import ContentToLoad from './ContentToLoad.jsx'
import AnimatedMaskPlane from './MaskPlane/MaskPlane.jsx'

import { useDispatch } from 'react-redux'
import { setProgress, setProgressStatus } from '../enterButtonSlice.js'
import { support_format_webp } from '../utils/modernImageFormat.js'

// There is loaded model/textures
export const SceneContext = createContext({})

export default function Experience() {
	const mouse = useThree((state) => state.mouse )

	return <>
		<LoadedChecker>

			{/* Scene render */}
			<EffectsLayout />
			<World mouse={ mouse } />
			
			{/* UI mask render */}
			<Hud renderPriority={ 2 }>
				<OrthographicCamera makeDefault position={[0, 0, 1]} near={0.1} far={0.5} zoom={80} />
				<AnimatedMaskPlane />
			</Hud>
		</LoadedChecker>
	</>
}

function LoadedChecker({ children }) {
	const [ data, updateData ] = useLoadingData()
	const [loadinStatus, changeLoadinStatus ] = useLoadingProgress()
	useEffect(() => {
		console.log( 'Content was loaded: ', loadinStatus )
	}, [loadinStatus])
	const contentImagesWasLoaded = useContentPreloader();

	return <>
		<Suspense fallback={ null }>
			<ContentToLoad 
				updateData={ updateData } 
				updateStatus={ changeLoadinStatus }
			/>
		</Suspense>

		<SceneContext.Provider value={ data }>
			{ (loadinStatus && contentImagesWasLoaded) ? children : null }
		</SceneContext.Provider>
	</>
}

function useContentPreloader() {
	const [ dataWasLoaded, setDataWasLoaded ] = useState( false );
	const [ loadedItems, setLoadedItems ] = useState(0);
	const isWebpSupport = support_format_webp()
    const formatJPG = isWebpSupport ? '.webp' : '.jpg'
	const contentImages = [
        '/backgrounds/works.svg',
        '/backgrounds/about.svg',
        '/backgrounds/image' + formatJPG,
        '/backgrounds/myworks/project-1' + formatJPG,
        '/backgrounds/myworks/project-2' + formatJPG,
        '/backgrounds/myworks/project-3' + formatJPG,
        '/backgrounds/myworks/project-4' + formatJPG,
        '/backgrounds/icon-1.svg',
        '/backgrounds/icon-2.svg',
        '/backgrounds/icon-3.svg',
        '/backgrounds/compass.svg',
        '/backgrounds/compass-dots.png', 
        '/backgrounds/compass-letter.png',
        '/backgrounds/grece.svg',
        '/backgrounds/dot.svg',
    ];
	const sounds = [
		'/audio/close-sound.mp3',
		'/audio/enter-sound.mp3',
		'/audio/open-sound.mp3'
	]

	useEffect(() => {
		sounds.forEach( src => {
			const audio = new Audio(src);
			audio.onloadeddata = () => {
				setLoadedItems( current => current + 1);
			};
		})
		contentImages.forEach( src => {
			const image = new Image();
			image.src = src;
			image.onload = () => setLoadedItems( current => current + 1);
		})
	}, [])
	useEffect(() => {
		const totalCount = sounds.length + contentImages.length;
		if (loadedItems !== totalCount ) return;

		setDataWasLoaded( true );
	}, [loadedItems])
	
	return dataWasLoaded;
}

function useLoadingProgress() {
	const [status, setStatus] = useState( false )
	const changeStatus = useCallback((value) => {
		setStatus( state => value )
	}, [])

	const dispatch = useDispatch()
	useEffect(() => {
		DefaultLoadingManager.onProgress = function (url, itemsLoaded, itemsTotal ) {
			dispatch(setProgress(itemsLoaded / itemsTotal))
		}
	}, [])
	useEffect(() => {
		dispatch(setProgressStatus( status ))
	}, [status])
	return [ status, changeStatus ]
}

function useLoadingData() {
	const [ data, setData] = useState( {} )
	
	const updateData = useCallback( newData => {
		setData( data => newData)
	}, [])

	return [ data, updateData ]
}