import { createSlice } from '@reduxjs/toolkit'

const menuType = [
    'default',
    'aboutMe',
    'myWorks'
]
export const menuButton = createSlice({
    name: 'menuButton',
    initialState: {
        value: {
            state: false,
            type: menuType[ 0 ]
        }
    },
    reducers: {
        toggleMenuState: ( state ) => {
            state.value.state = !state.value.state
        },
        toggleMyWork: ( state ) => {
            state.value.type = menuType[2]
        },
        toggleAboutMe: ( state ) => {
            state.value.type = menuType[1]
        },
        resetMenuState: (state) => {
            state.value.type = menuType[0]
        }
    },
})


export const { toggleMenuState, toggleMyWork, toggleAboutMe, resetMenuState } = menuButton.actions
export const getMenuButtonState = (state) => state.menuState.value.type
export const getMenuState = (state) => state.menuState.value.state
export default menuButton.reducer
