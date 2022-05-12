import * as THREE from 'three'

import Experience from '../Experience'

export default class Tower {
    constructor () {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.loadMaterials()
        this.generateShape()
    }
    loadMaterials() {
        this.resources.items.towerTexture1.flipY = false
        this.resources.items.towerTexture1.encoding = THREE.sRGBEncoding
        this.resources.items.towerTexture1.magFilter = THREE.NearestFilter
        this.resources.items.towerTexture2.flipY = false
        this.resources.items.towerTexture2.encoding = THREE.sRGBEncoding
        this.resources.items.towerTexture2.magFilter = THREE.NearestFilter

        this.towerMaterial1 = new THREE.MeshBasicMaterial({
            map: this.resources.items.towerTexture1
        })
        this.towerMaterial2 = new THREE.MeshBasicMaterial({
            map: this.resources.items.towerTexture2
        })
    }
    generateShape() {
        const towerScene = this.resources.items.towerModel.scene
        const tower = new THREE.Group()

        const towerPart1 = towerScene.children.find((child) => child.name === 'part2')
        const towerPart2 = towerScene.children.find((child) => child.name === 'part1')
        
        towerPart1.material = this.towerMaterial1
        towerPart2.material = this.towerMaterial2
        
        tower.add( towerPart1, towerPart2 )
        tower.scale.set( 0.47, 0.47, 0.47 )
        tower.position.y = 0.37

        this.scene.add( tower )
    }
}