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
        // Add Sky
        const that = this
        const sky = new Sky()
        sky.scale.setScalar( 10)
        this.scene.add( sky )

        const sun = new THREE.Vector3()

        /// GUI
        const effectController = {
            turbidity: 2,
            rayleigh: 0.33,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.8,
            luminance: 1.1,
            elevation: 90,
            azimuth: 180,
            exposure: this.renderer.instance.toneMappingExposure
        }

        function guiChanged() {
            const uniforms = sky.material.uniforms
            uniforms[ 'turbidity' ].value = effectController.turbidity
            uniforms[ 'rayleigh' ].value = effectController.rayleigh
            uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient
            uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG

            const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation )
            const theta = THREE.MathUtils.degToRad( effectController.azimuth )
            console.log(sky.material.fragment)
            sun.setFromSphericalCoords( 1, phi, theta )

            uniforms[ 'sunPosition' ].value.copy( sun )

            that.renderer.instance.toneMappingExposure = effectController.exposure
        }
        
        guiChanged()

        if (this.debug.active) {
            this.debugFolder.add( effectController, 'turbidity').min(0).max(20).step(0.001).onChange( guiChanged )
            this.debugFolder.add( effectController, 'rayleigh').min(0).max(4).step(0.001).onChange( guiChanged )
            this.debugFolder.add( effectController, 'mieCoefficient').min(0).max(0.1).step(0.001).onChange( guiChanged )
            this.debugFolder.add( effectController, 'mieDirectionalG').min(0).max(1).step(0.001).onChange( guiChanged )
            this.debugFolder.add( effectController, 'elevation').min(0).max(90).step(0.001).onChange( guiChanged )
            this.debugFolder.add( effectController, 'azimuth').min(-180).max(180).step(0.001).onChange( guiChanged )
            this.debugFolder.add( effectController, 'exposure').min(0).max(2).step(0.001).onChange( guiChanged )
        }
    }
}

			