import * as THREE from 'three'
import gsap from 'gsap'

import Experience from '../Experience'

export default class Tower {
    constructor () {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug


        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Tower')
        }
        this.loadMaterials()
        this.generateShape()
    }
    loadMaterials() {
        this.resources.items.towerTexture.flipY = false
        this.resources.items.towerTexture.encoding = THREE.sRGBEncoding

        this.towerMaterial = new THREE.MeshBasicMaterial({
            map: this.resources.items.towerTexture
        })
    }
    generateShape() {
        const towerScene = this.resources.items.towerModel.scene

        const towerModel = towerScene.children.find((child) => child.name === 'tower')
        towerModel.material = this.towerMaterial
        towerModel.scale.setScalar(0.47)
        towerModel.position.y = 2.1
        
        this.scene.add( towerScene )
    }
}