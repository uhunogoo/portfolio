import { createSlice } from '@reduxjs/toolkit'

export const enterButton = createSlice({
	name: 'enterButton',
	initialState: {
		value: true,
		toggle: true,
		ready: false,
		progress: 0,
		progressStatus: false
	},
	reducers: {
		toggleEnterState: (state) => {
			state.value = false
		},
		setEnterState: (state) => {
			state.toggle = false
		},
		setEnterReady: (state) => {
			state.ready = true
		},
		setProgress: (state, value) => {
			state.progress = value.payload
		},
		setProgressStatus: (state, value) => {
			state.progressStatus = value.payload
		}
	},
})


export const { toggleEnterState, setEnterState, setEnterReady, setProgress, setProgressStatus } = enterButton.actions
export const getEnterButtonState = (state) => state.enterState.value
export const getEnterState = (state) => state.enterState.toggle
export const getEnterready = (state) => state.enterState.ready
export const getProgress = (state) => state.enterState.progress
export const getProgressStatus = (state) => state.enterState.progressStatus
export default enterButton.reducer
