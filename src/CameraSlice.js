import { createSlice } from '@reduxjs/toolkit'

export const camera = createSlice({
    name: 'camera',
    initialState: {
        points: [
            {
                rotation: [-1, 0, 0],
                position: [0, 0, 0]
            },
            {
                rotation: [0, 1, 0],
                position: [-2.5, -1, 8.5],
            },
        ],
        default: [ 0, 0, 0 ],
        target: [ 0, 0, 0 ]
    },
    reducers: {
        setDefault: ( state, value ) => {
            state.default = value.payload 
        },
        setTarget: ( state, value ) => {
            state.target = state.points[ value.payload ] 
        },
        resetTarget: ( state ) => { 
            state.target = state.default 
        }
    },
})


export const { setTarget, resetTarget, setDefault } = camera.actions
export const getCameraPoints = (state) => state.cameraState.points
export const getCameraTarget = (state) => state.cameraState.target
export default camera.reducer
