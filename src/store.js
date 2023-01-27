import { configureStore } from '@reduxjs/toolkit'
import cameraReducer from './CameraSlice.js'
import enterButtonReducer from './enterButtonSlice.js'
import menuButtonReducer from './menuButtonSlice.js'
import mouseReducer from './mouseSlice.js'

export default configureStore({
  reducer: {
    enterState: enterButtonReducer,
    menuState: menuButtonReducer,
    mouseState: mouseReducer,
    cameraState: cameraReducer
  },
})