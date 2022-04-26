import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky'


import Experience from '../Experience'

export default class Skybox {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.renderer = this.experience.renderer
        this.camera = this.experience.camera
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Sky')
        }

        this.createSky()
    }
    createSky() {
        const debug = {
            fogColor: '#262837',
            fogNear: 1,
            fogFar: 60,
            skyColor: '#ffffff'
        }
        const fog = new THREE.Fog(debug.fogColor, debug.fogNear, debug.fogFar)
        this.scene.fog = fog
        
        // Add Sky
        const skyGeometry = new THREE.SphereBufferGeometry(15, 40, 40)
        const skyMaterial = new THREE.MeshStandardMaterial({color: debug.clearColor, side: THREE.DoubleSide})
        const skyMesh = new THREE.Mesh( skyGeometry, skyMaterial )
        
        this.scene.add( skyMesh )


        if (this.debug.active) {

            this.debugFolder
                .addColor( debug, 'fogColor')
                .name('fogColor')
                .onChange(() => {
                    this.scene.fog.color = new THREE.Color(debug.fogColor)
                })
            this.debugFolder
                .add( fog, 'near')
                .name('fogNear')
                .min(0)
                .max(80)
                .step(0.001)
            this.debugFolder
                .add( fog, 'far')
                .name('fogFar')
                .min(0)
                .max(80)
                .step(0.001)
                
            this.debugFolder
                .addColor( debug, 'skyColor')
                .name('skyColor')
                .onChange(() => {
                    skyMesh.material.color = new THREE.Color( new THREE.Color(debug.skyColor) )
                })
        }
    }
}

			