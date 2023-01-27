import '../assets/mainPage.css'
import { useSelector } from 'react-redux'
import { getEnterButtonState } from '../enterButtonSlice.js'
import { getMenuButtonState } from '../menuButtonSlice.js'

import PreLoader from '../Components/PreLoader.jsx'
import UI from '../Components/UI.jsx'
import ModalPage from '../Components/ModalPage.jsx'


const PreloaderAndUI = () => {
    const enter = useSelector( getEnterButtonState )

    return <>
        { enter ? <PreLoader /> : <UI /> }
    </>
}
const Modal = () => {
    const menu = useSelector( getMenuButtonState )
    
    return <>
        { (menu !== 'default') ? <ModalPage /> : null }
    </>
}

export default function MainPage() {
    return <>
        <div className="main-page">
            <PreloaderAndUI />
            <Modal />
        </div>
    </>
}