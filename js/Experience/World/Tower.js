import * as THREE from 'three'

import Experience from '../Experience'

// Portal shaders
import vertexShader from '../../../asstes/shaders/portal/portalVertex.glsl?raw'
import fragmentShader from '../../../asstes/shaders/portal/portalFragment.glsl?raw'

export default class Tower {
    constructor () {
        // Setup
        this.experience = new Experience()
        this.towerGroup = new THREE.Group()
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Defaults
        this.customUniform = {
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color('#d4b268') },
            uColor2: { value: new THREE.Color('#ebebeb') },
        }

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('portal')
            this.debugFolder.close()
        }

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
        // this.towerMaterial4 = new THREE.ShaderMaterial({
        //     uniforms: this.customUniform,
        //     side: THREE.DoubleSide,
        //     vertexShader,
        //     fragmentShader,
        // })

        if (this.debug.active) {
            this.debugFolder
                .addColor( this.customUniform.uColor1, 'value')
                .name('color1')
                .onChange( () => {
                    this.towerMaterial4.uniforms.uColor1.value = this.customUniform.uColor1.value
                })
            this.debugFolder
                .addColor( this.customUniform.uColor2, 'value')
                .name('color2')
                .onChange( () => {
                    this.towerMaterial4.uniforms.uColor2.value = this.customUniform.uColor2.value
                })
        }
    }
    generateShape() {
        const towerScene = this.resources.items.towerModel.scene
        const tower = new THREE.Group()
        tower.name = 'towerGroup'

        const towerPart1 = towerScene.children.find((child) => child.name === 'floor')
        const towerPart2 = towerScene.children.find((child) => child.name === 'walls')
        const towerPart3 = towerScene.children.find((child) => child.name === 'components')
        const towerPart4 = towerScene.children.find((child) => child.name === 'portal')

        towerPart4.geometry.computeVertexNormals()        
        
        towerPart1.material = this.towerMaterial1
        towerPart2.material = this.towerMaterial2
        towerPart3.material = this.towerMaterial3
        towerPart4.material = this.towerMaterial4
        
        tower.add( towerPart1, towerPart2, towerPart3, towerPart4 )
        tower.scale.set( 0.47, 0.47, 0.47 )

        this.towerGroup = tower
    }
    update() {
        this.customUniform.uTime.value = this.experience.time.elapsed / 1000
    }
}