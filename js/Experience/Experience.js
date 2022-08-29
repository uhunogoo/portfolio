import * as THREE from 'three'
import * as _ from 'lodash-es'

import Sizes from './Utils/Sizes'
import Time from './Utils/Time'
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World/World'
import Resources from './Utils/Resources'
import Preload from './Preload'
import sources from './sources'

// Debug
import Debug from './Utils/Debug'
import Points from './Utils/Points'
import Mouse from './Utils/Mouse'
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
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.mouse = new Mouse()
        this.deviceOrientationEvent = new DeviceOrientationEvent()
        this.points = new Points()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.preload = new Preload()
        this.world = new World()

        // Sizes resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Mosue move event
        const throttleMouseFunction = _.throttle(() => {           
            this.mouseMove() 
        }, 40)
        this.mouse.on('mouseMove', () => {
            throttleMouseFunction()
        })
        this.mouse.on('mouseClick', () => {
            this.mouseClick()
        })

        // Device orientation
        const throttleDeviceOrientationFunction = _.throttle(() => {           
            this.deviceOrientation() 
        }, 80)
        this.deviceOrientationEvent.on('deviceOrientation', () => {
            throttleDeviceOrientationFunction()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
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
        this.world.mouseMove()
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