import { Scene } from 'three'

import Camera from './Camera'
import Renderer from './Renderer'
import World from './World/World'
import Preload from './Preload'
import sources from './sources'

// Utils
import Sizes from './Utils/Sizes'
import Time from './Utils/Time'
import Debug from './Utils/Debug'
import Points from './Utils/Points'
import Mouse from './Utils/Mouse'
import Resources from './Utils/Resources'
import DeviceOrientationEvent from './Utils/DeviceOrientation'


let instance = null

export default class Experience {
    constructor(canvas) { 

        if(instance) {
            return instance
        }
        instance = this

        // options
        this.canvas = canvas

        // Setup
        this.sizes = new Sizes()
        this.mouse = new Mouse()
        this.resources = new Resources(sources)

        this.debug = new Debug()
        this.scene = new Scene()
        this.scene1 = new Scene()
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.preload = new Preload()

        // Wait for environment
        this.resources.on('loadingProgress', () => {
            this.preload.loadingProcess()
        })
        this.resources.on('ready', () => {
            this.deviceOrientationEvent = new DeviceOrientationEvent()
            this.points = new Points()
            this.time = new Time()
            this.world = new World()

             // Mosue click event
            this.mouse.on('mouseClick', () => {
                this.mouseClick()
            })

            // Device orientation event
            this.deviceOrientationEvent.on('deviceOrientation', () => {
                this.deviceOrientation() 
            })

            // Time tick event
            this.time.on('tick', () => {
                this.update()
            })

            // Sizes resize event
            this.sizes.on('resize', () => {
                this.resize()
            })
            this.preload.loadingComplete()
        })


        // Mosue move event
        this.mouse.on('mouseMove', () => {
            this.mouseMove() 
        })
    }
    resize() {
        this.world.resize()
        this.camera.resize()
        this.renderer.resize()
        this.preload.resize()
    }
    mouseClick() {
        this.preload.mouseClick()
        this.world.mouseClick()
    }
    deviceOrientation() {
        this.world.deviceOrientation()
    }
    mouseMove() {
        if (this.world) {
            this.world.mouseMove()
        }
    }
    update() {
        this.debug.update()
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }
    destroy() {
        this.sizes.off('resize')
        this.time.off('tick')
        this.mouse.off('mouseMove')
    }
}
