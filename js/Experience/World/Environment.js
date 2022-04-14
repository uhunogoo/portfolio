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
        }

        this.setSunLight()
    }
    setSunLight() {
        this.sunLight = new THREE.DirectionalLight( 0xffffff, 2 )
        // this.sunLight.castShadow = true
        // this.sunLight.shadow.camera.far = 15
        // this.sunLight.shadow.mapSize.set(1024, 1024)
        // this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set( 0, 1, 8 )
        
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
        }
    }
}