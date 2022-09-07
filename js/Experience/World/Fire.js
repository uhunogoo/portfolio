import { Color, CylinderBufferGeometry, DoubleSide, Group, Mesh, ShaderMaterial } from 'three'
import Experience from '../Experience'

// Sword shaders
import swordFireVertex from '../../../asstes/shaders/sword/fireVertex.glsl?raw'
import swordFireFragment from '../../../asstes/shaders/sword/fireFragment.glsl?raw'

export default class Fire {
    constructor() {
        this.experience = new Experience()
        this.fireGroup = new Group()
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Fire')
            this.debugFolder.close()
        }
        
        // Setup
        this.options = {}
        this.options.x = 3.82
        this.options.y = 0.6
        this.options.z = -1.77
        this.fireUniform = {
            uTime: { value: 0 },
            uColor1: { value: new Color('#ff0000') },
            uColor2: { value: new Color('#fff700') },
            uColor3: { value: new Color('#e6893d') },
        }

        this.createFire()
    }
    createFire() {
        // Shape around te sword
        const geometry = new CylinderBufferGeometry(0.4, 0.165, 0.25, 10, 10)
        
        // Generate fire around the sword
        // const fireGeometry
        const swordFireMaterial = new ShaderMaterial({
            uniforms: this.fireUniform,
            side: DoubleSide,
            vertexShader: swordFireVertex,
            fragmentShader: swordFireFragment
        })
        const fireMesh = new Mesh( geometry, swordFireMaterial )
        fireMesh.position.x = this.options.x
        fireMesh.position.y = this.options.y
        fireMesh.position.z = this.options.z

        this.fireGroup.add(fireMesh)

        // Debug shader material
        if (this.debug.active) {
            this.debugFolder.addColor( this.fireUniform.uColor1, 'value').name('fireColor 1').onChange( () => {
                this.fireUniform.uColor1.value = this.fireUniform.uColor1.value
            })
            this.debugFolder.addColor( this.fireUniform.uColor2, 'value').name('fireColor 2').onChange( () => {
                this.fireUniform.uColor2.value = this.fireUniform.uColor2.value
            })
            this.debugFolder.addColor( this.fireUniform.uColor3, 'value').name('fireColor 3').onChange( () => {
                this.fireUniform.uColor3.value = this.fireUniform.uColor3.value
            })
        }
    }
    update() {
        this.fireUniform.uTime.value = this.experience.time.elapsed / 1000
    }
}