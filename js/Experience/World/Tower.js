import { Color, DoubleSide, Group, MeshBasicMaterial, ShaderMaterial } from 'three'
import Experience from '../Experience'

// Portal shaders
import portalVertex from '../../../asstes/shaders/portal/portalVertex.glsl?raw'
import portalFragment from '../../../asstes/shaders/portal/portalFragment.glsl?raw'
import runicVertex from '../../../asstes/shaders/runic/runicVertex.glsl?raw'
import runicFragment from '../../../asstes/shaders/runic/runicFragment.glsl?raw'
import gsap from 'gsap'

export default class Tower {
    constructor () {
        // Setup
        this.experience = new Experience()
        this.towerGroup = new Group()
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Defaults
        this.customUniform = {
            uTime: { value: 0 },
            uColor1: { value: new Color('#d4b268') },
            uColor2: { value: new Color('#ebebeb') },
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
        this.towerMaterial1 = new MeshBasicMaterial({
            map: this.resources.items.towerTexture1
        })
        this.towerMaterial2 = new MeshBasicMaterial({
            map: this.resources.items.towerTexture2
        })
        this.towerMaterial3 = new MeshBasicMaterial({
            map: this.resources.items.towerTexture3
        })
        this.towerMaterial4 = new ShaderMaterial({
            uniforms: {
				uTexture: { value: this.resources.items.towerTexture3 },
				uColorMap: { value: this.resources.items.towerTexture4 },
				uTime: { value: 0 },
				uFinal: { value: 0.0 }
			},
            vertexShader: runicVertex,
            fragmentShader: runicFragment,
        })
        this.towerMaterial5 = new ShaderMaterial({
            uniforms: this.customUniform,
            side: DoubleSide,
            vertexShader: portalVertex,
            fragmentShader: portalFragment,
        })

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
        const tower = new Group()
        tower.name = 'towerGroup'

        const towerPart1 = towerScene.children.find((child) => child.name === 'floor')
        const towerPart2 = towerScene.children.find((child) => child.name === 'walls')
        const towerPart3 = towerScene.children.find((child) => child.name === 'components')
        const towerPart4 = towerScene.children.find((child) => child.name === 'runic')
        const towerPart5 = towerScene.children.find((child) => child.name === 'portal')

        towerPart4.geometry.computeVertexNormals()        
        
        towerPart1.material = this.towerMaterial1
        towerPart2.material = this.towerMaterial2
        towerPart3.material = this.towerMaterial3
        towerPart4.material = this.towerMaterial4
        towerPart5.material = this.towerMaterial5	
        
        tower.add( towerPart1, towerPart2, towerPart3, towerPart4, towerPart5 )
        tower.scale.set( 0.47, 0.47, 0.47 )

        this.towerGroup = tower
    }
    update() {
		const time = this.experience.time.elapsed / 1000
        this.customUniform.uTime.value = time
		this.towerMaterial4.uniforms.uTime.value = time
    }
}
