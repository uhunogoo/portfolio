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
        this.stonesParameters = {
            count: 6,
            radius: 0.6,
            theta: Math.PI * 0.5,
            yPosition: 2
        }

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Grass')
        }
        this.generateCircularShape()
        this.createStones()

        this.animation()
    }
    generateCircularShape() {
        const { radius, theta, count } = this.stonesParameters
        this.circleShape = new THREE.CircleGeometry( radius, count, theta )
        this.stepAngle = (Math.PI * 2) / count
    }
    createStones() {
        this.stonesGroup = new THREE.Group()

        const stoneGeometry = new THREE.BoxBufferGeometry(1, 1.5, 0.5)
        const stoneMaterial = new THREE.MeshBasicMaterial()

        const {count, yPosition} = this.stonesParameters
    
        // base geometry parameters
        const positions = this.circleShape.getAttribute('position').array
    
        // Create geometry on each circle vertices
        // Start from 1 because 0 is center
        for (let i = 1; i <= count; i++) {
            const i3 = i * 3
            
            const geometry = stoneGeometry.clone()
            const material = stoneMaterial.clone()
            const stoneMesh = new THREE.Mesh( geometry, material )
            stoneMesh.scale.set(0.2, 0.2, 0.2)
            // aply positions but flip z and y values
            stoneMesh.position.set(
                positions[i3 + 0] * -1,
                positions[i3 + 2],
                positions[i3 + 1]
            )
            stoneMesh.rotation.y = this.stepAngle * (i - 1)
            this.stonesGroup.add( stoneMesh )

        }
        this.stonesGroup.position.y = yPosition
        this.scene.add( this.stonesGroup )
    }
    animation() {
        const rotation = gsap.to(this.stonesGroup.rotation, {
            y: Math.PI *2,
            repeat: -1,
            duration: 1.5,
            ease: 'none',
        })
        
        const eachStonePosition = this.stonesGroup.children.map( el => el.position )
    }
}