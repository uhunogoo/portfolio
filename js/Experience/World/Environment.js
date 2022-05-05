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
        this.sunLight = new THREE.DirectionalLight( 0xffffff, 2.3 )
        this.sunLight.position.set( 0, 2.6, 2.1 )
        
        this.pointLight = new THREE.PointLight( 0xffffff, 2.3, 20, 2 )
        this.pointLight.castShadow = true
        this.pointLight.shadow.camera.far = 3
        this.pointLight.shadow.mapSize.set(1024, 1024)
        this.pointLight.shadow.normalBias = 0.05
        this.pointLight.position.set( 0, 2.6, 2.1 )
        
        this.ambientLight = new THREE.AmbientLight( 0xffffff, 0.5)
        
        this.scene.add( this.sunLight, this.pointLight, this.ambientLight )

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