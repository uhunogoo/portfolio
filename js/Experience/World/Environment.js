import * as THREE from 'three' 
import Experience from '../Experience'

export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Environment')
            this.debugFolder.close()
        }

        this.setSunLight()
    }
    setSunLight() {
        this.sunLight = new THREE.DirectionalLight( 0xffffff, 1 )
        // this.sunLight.castShadow = true
        // this.sunLight.shadow.camera.far = 3
        // this.sunLight.shadow.mapSize.set(1024, 1024)
        // this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set( 0, 2.6, 2.1 )
        
        this.ambientLight = new THREE.AmbientLight( 0xffffff, 0.5)
        
        this.scene.add( this.sunLight, this.ambientLight )

        // Debug light
        if (this.debug.active) {
            this.debugFolder
                .add(this.sunLight, 'intensity')
                .name('sunIntensity')
                .min(0)
                .max(10)
                .step(0.001)

            // position
            this.debugFolder
                .add(this.sunLight.position, 'x')
                .name('light x')
                .min(-10)
                .max(10)
                .step(0.001)
            this.debugFolder
                .add(this.sunLight.position, 'y')
                .name('light y')
                .min(-10)
                .max(10)
                .step(0.001)
            this.debugFolder
                .add(this.sunLight.position, 'z')
                .name('light z')
                .min(-10)
                .max(10)
                .step(0.001)
        }
    }
}