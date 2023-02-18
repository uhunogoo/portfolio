import './assets/index.css'
import store from './store.js'

import React, { lazy } from 'react'
import { Provider } from 'react-redux'

import { Canvas } from '@react-three/fiber'
import { createRoot } from 'react-dom/client'

const MainPage = lazy(() => import('./Pages/MainPage.jsx'))
const Experience = lazy(() => import('./WebGL/Experience.jsx'))

document.addEventListener('DOMContentLoaded', () => {
	const root = createRoot(document.getElementById('root'))
	
	root.render(
		<React.StrictMode>
			<Provider store={ store }>
				<MainPage />
				<Canvas 
					dpr={ 1 } 
					shadows={false}
					gl={{
						powerPreference: 'high-performance', 
						toneMappingExposure: 1.1
					}}
					flat={ false } className="webgl" 
				>
					<Experience />
				</Canvas>
			</Provider>
		</React.StrictMode>
	)
})
