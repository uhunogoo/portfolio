// import './style.css'

import Experience from './js/Experience/Experience'

const canvas = document.querySelector('canvas.webgl')

window.addEventListener("load", () => {
    const experiance = new Experience( canvas )
});