import { Color, CylinderGeometry, DoubleSide, Group, Mesh, ShaderMaterial } from 'three'
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
        this.options.y = 0.459
        this.options.x = 1.77
        this.options.z = 3.82
        this.fireUniform = {
            uTime: { value: 0 },
            uStrength: { value: 3.7 },
            uStrengthBottom: { value: 3.2 },
			uFlameSpire: { value: 1 },
			uFireType: { value: 0 },
            uColor1: { value: new Color('#ff0000') },
            uColor2: { value: new Color('#fff700') },
            uColor3: { value: new Color('#e6893d') },
        }

        this.createFire()
    }
    createFire() {
        // Shape around te sword
        const geometry = new CylinderGeometry(0.06, 0.19, 0.21, 10, 10)
        
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

		fireMesh.material.uniforms.uFlameSpire.value = 6
		fireMesh.material.uniforms.uFireType.value = 1

        this.fireGroup.add(fireMesh)

        // Debug shader material
        if (this.debug.active) {
			this.debugFolder
				.add( fireMesh.position, 'y')
				.name('firePositionY')
				.min(0).max(1).step(0.001)
			this.debugFolder
				.add( fireMesh.material.uniforms.uFlameSpire, 'value')
				.name('fireSpire')
				.min(0).max(10).step(0.001)

			this.debugFolder
				.add( this.fireUniform.uStrength, 'value')
				.name('fireStrength')
				.min(0).max(8).step(0.001)
				.onChange( () => { fireMesh.material.uniforms.uStrength.value = this.fireUniform.uStrength.value })
			this.debugFolder
				.add( this.fireUniform.uStrengthBottom, 'value')
				.name('fireStrength')
				.min(0).max(8).step(0.001)
				.onChange( () => { 
					fireMesh.material.uniforms.uStrengthBottom.value = this.fireUniform.uStrengthBottom.value 
				})


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
		const time = this.experience.time.elapsed / 1000
        this.fireUniform.uTime.value = time
		// this.fireGlobe.material.uniforms.uTime.value = time
    }
}
