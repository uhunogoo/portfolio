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
            count: 5,
            radius: 0.6,
            theta: Math.PI * 0.5,
            yPosition: 2
        }
        this.parameters = {}

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Stones')
            // this.debugFolder.close()
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
        this.parameters.color = 0x2d2d2d
        this.stonesGroup = new THREE.Group()

        const stoneGeometry = this.resources.items.stoneModel.scene.children.find( child => child.name === 'stone').geometry
        const stoneMaterial = new THREE.MeshStandardMaterial({ color: this.parameters.color })

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

            // aply positions but flip z and y values
            stoneMesh.position.set(
                positions[i3 + 0] * -1,
                positions[i3 + 2],
                positions[i3 + 1]
            )
            stoneMesh.rotation.y = this.stepAngle * (i - 1)
            stoneMesh.scale.set(0.12, 0.12, 0.12)

            this.stonesGroup.add( stoneMesh )

        }
        this.stonesGroup.position.y = yPosition
        this.scene.add( this.stonesGroup )

        // Debug shader material
        if (this.debug.active) {
            this.debugFolder.addColor( this.parameters, 'color').name('stonesColor').onChange( () => {
                this.stonesGroup.children.forEach(stone => stone.material.color.set(this.parameters.color) )
            })
        }
    }
    animation() {
        gsap.to(this.stonesGroup.rotation, {
            y: Math.PI *2,
            duration: 2,
            ease: 'none',
            repeat: -1
        })
        
        
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