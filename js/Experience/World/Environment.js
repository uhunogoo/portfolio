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
        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 )
        hemiLight.color.setHSL( 0.6, 1, 0.6 )
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 )
        hemiLight.position.set( 0, 50, 0 )
        
        this.scene.add( hemiLight )
    }
}