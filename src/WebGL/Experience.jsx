import { DefaultLoadingManager } from 'three'

import { Hud, OrthographicCamera } from '@react-three/drei'

import { useThree } from '@react-three/fiber'
import React, { useState, useCallback, Suspense, useEffect, createContext } from 'react'
// import { Perf } from 'r3f-perf'
import { Leva } from 'leva'

import World from './World/World.jsx'
import EffectsLayout from './Effects.jsx'
import ContentToLoad from './ContentToLoad.jsx'
import AnimatedMaskPlane from './MaskPlane/MaskPlane.jsx'

import { useDispatch } from 'react-redux'
import { setProgress, setProgressStatus } from '../enterButtonSlice.js'

// There is loaded model/textures
export const SceneContext = createContext({})

export default function Experience() {
	const mouse = useThree((state) => state.mouse )

	return <>
		<LoadedChecker>
			{/* <Perf position='top-left' /> */}
			<Leva hidden/>

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
	return <>
		<Suspense fallback={ null }>
			<ContentToLoad 
				updateData={ updateData } 
				updateStatus={ changeLoadinStatus }
			/>
		</Suspense>

		<SceneContext.Provider value={ data }>
			{ loadinStatus ? children : null }
		</SceneContext.Provider>
	</>
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