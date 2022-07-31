import * as THREE from 'three'

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
        this.points = new Points()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()
        this.preload = new Preload()

        // Sizes resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
        })
    }
    resize() {
        this.camera.resize()
        this.renderer.resize()
        this.preload.resize()
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
    }
}