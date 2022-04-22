import * as THREE from 'three'
import gsap from 'gsap'

import Experience from '../Experience'

export default class Stones {
    constructor () {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Setup
        this.parameters = {
            radius: 2,
            theta: Math.PI * 0.5,
            yPosition: 2
        }

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Stones')
            // this.debugFolder.close()
        }
        this.generateShape()
    }
    generateShape() {
        const shape = new THREE.PlaneBufferGeometry( this.parameters.radius, this.parameters.radius )
        const shapeMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
        
        const mesh = new THREE.Mesh( shape, shapeMaterial )
        mesh.position.y = this.parameters.yPosition
        mesh.rotation.x = Math.PI * 0.5

        this.scene.add(mesh)
    }
    animation() { 
        gsap.to(this.stonesGroup.position, {
            keyframes:{
                "50%":{y: '+=0.05', ease:"sine"},
                "100%":{y: '-=0.05', ease:"sine"},
            },
            repeat: -1,
            ease: 'none',
            duration: 1.2
        })
    }
}