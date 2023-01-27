import { createSlice } from '@reduxjs/toolkit'

export const mouse = createSlice({
    name: 'mouse',
    initialState: {
        value: {
            x: 0,
            y: 0
        },
    },
    reducers: {
        setMouse: ( state, value ) => {
            state.value.x = value.payload.x 
            state.value.y = value.payload.y 
        }
    },
})


export const { setMouse } = mouse.actions
export const getMouseState = (state) => state.mouseState.value
export default mouse.reducer
