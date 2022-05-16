import * as THREE from 'three'

import Experience from '../Experience'

export default class Tower {
    constructor () {
        this.experience = new Experience()
        this.towerGroup = new THREE.Group()
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
        this.resources.items.towerTexture3.flipY = false
        this.resources.items.towerTexture3.encoding = THREE.sRGBEncoding
        this.resources.items.towerTexture3.magFilter = THREE.NearestFilter

        this.towerMaterial1 = new THREE.MeshBasicMaterial({
            map: this.resources.items.towerTexture1
        })
        this.towerMaterial2 = new THREE.MeshBasicMaterial({
            map: this.resources.items.towerTexture2
        })
        this.towerMaterial3 = new THREE.MeshBasicMaterial({
            map: this.resources.items.towerTexture3
        })
        this.towerMaterial4 = new THREE.MeshBasicMaterial()
    }
    generateShape() {
        const towerScene = this.resources.items.towerModel.scene
        const tower = new THREE.Group()
        tower.name = 'towerGroup'

        const towerPart1 = towerScene.children.find((child) => child.name === 'floor')
        const towerPart2 = towerScene.children.find((child) => child.name === 'walls')
        const towerPart3 = towerScene.children.find((child) => child.name === 'components')
        const towerPart4 = towerScene.children.find((child) => child.name === 'portal')
        
        towerPart1.material = this.towerMaterial1
        towerPart2.material = this.towerMaterial2
        towerPart3.material = this.towerMaterial3
        towerPart4.material = this.towerMaterial4
        
        tower.add( towerPart1, towerPart2, towerPart3, towerPart4 )
        tower.scale.set( 0.47, 0.47, 0.47 )

        this.towerGroup = tower
    }
}