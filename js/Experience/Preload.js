import gsap from 'gsap'
import Experience from './Experience'

export default class Preload {
    constructor() {
        // Options
        this.experience = new Experience()
        this.resources = this.experience.resources

        // Setup
        this.progress = { value: 0 }
        this.progressBlock = document.querySelector('.loader span')
        
        // action
        this.resources.on('loadingProgress', () => {
            this.loading()
        })
        this.resources.on('ready', () => {
            this.load()
        })
    }
    loading() {
        const that = this
        // experience
        gsap.to( this.progress, {
            value: (this.resources.loaded / this.resources.toLoad),
            duration: 1,
            
            onUpdate: animationUpdate
        })
        function animationUpdate() {
            const v = 100 * this.progress().toFixed(2)
            that.progressBlock.innerHTML = v.toFixed(0)
        }
    }
    load() {
        gsap.to( '.loader', {
            delay: 2,
            autoAlpha: true  
        })
    }
}