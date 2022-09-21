import { Color, SphereGeometry, DoubleSide, Group, Mesh, ShaderMaterial } from 'three'
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
        this.options.y = 0.53
        this.options.x = 1.77
        this.options.z = 3.82
        this.fireUniform = {
            uTime: { value: 0 },
            uStrength: { value: 0.92 },
            uStrengthBottom: { value: 3.0 },
			uFlameSpire: { value: 1 },
			uFireType: { value: 0 },
            uColor1: { value: new Color('#ff0000') },
            uColor2: { value: new Color('#fff700') },
            uColor3: { value: new Color('#e6893d') },
        }

        this.createFire()
    }
    createFire() {
		const fire = {}
		fire.detail = 4
		fire.size = { x: 0.33, y: 0.4 }
		// fire.geometry = new PlaneGeometry(1, 1)
		fire.material = new ShaderMaterial({
            uniforms: this.fireUniform,
            side: DoubleSide,
            vertexShader: swordFireVertex,
            fragmentShader: swordFireFragment
        })
		fire.group = new Group()

		// // Generate fire
		// for (let i = 0; i < fire.detail; i++ ) {
		// 	const geometry = fire.geometry.clone() 
		// 	const material = fire.material
		// 	const fireMesh = new Mesh( geometry, material )

		// 	fireMesh.scale.set( fire.size.x, fire.size.y, 1 )
		// 	fireMesh.rotation.y = Math.PI * ( 1 / fire.detail ) * i
			
		// 	fire.group.add( fireMesh )
		// }
		
		// fire.group.position.x = 0
        // fire.group.position.y = 1
        // fire.group.position.z = 5
		fire.group.position.x = this.options.x
        fire.group.position.y = this.options.y - fire.size.y * 0.08
        fire.group.position.z = this.options.z
		

		this.fireGlobe = new Mesh( 
			new SphereGeometry(0.17, 10, 10),
			fire.material.clone()
		)
		
		this.fireGlobe.material.uniforms.uFlameSpire.value = 1
		this.fireGlobe.material.uniforms.uFireType.value = 1

		this.fireGlobe.position.x = this.options.x
		this.fireGlobe.position.y = 0.45
		this.fireGlobe.position.z = this.options.z
		this.fireGlobe.rotation.y = - Math.PI * 0.5

		// this.fireGroup.add( fire.group )
		this.fireGroup.add( this.fireGlobe )
        // Debug shader material
        if (this.debug.active) {
			this.debugFolder.add( this.fireGlobe.position, 'y').name('firePositionY').min(0).max(1).step(0.001)
			this.debugFolder.add( this.fireGlobe.material.uniforms.uFlameSpire, 'value').name('fireSpire').min(0).max(10).step(0.001)

			this.debugFolder.add( this.fireUniform.uStrength, 'value').name('fireStrength').min(0).max(8).step(0.001)
				.onChange( () => { this.fireGlobe.material.uniforms.uStrength.value = this.fireUniform.uStrength.value })
			this.debugFolder.add( this.fireUniform.uStrengthBottom, 'value').name('fireStrength').min(0).max(8).step(0.001)
				.onChange( () => { this.fireGlobe.material.uniforms.uStrengthBottom.value = this.fireUniform.uStrengthBottom.value })

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
    // createFire() {
    //     // Shape around te sword
    //     const geometry = new CylinderGeometry(0.12, 0.15, 0.25, 10, 10)
        
    //     // Generate fire around the sword
    //     // const fireGeometry
    //     const swordFireMaterial = new ShaderMaterial({
    //         uniforms: this.fireUniform,
    //         side: DoubleSide,
    //         vertexShader: swordFireVertex,
    //         fragmentShader: swordFireFragment
    //     })
    //     const fireMesh = new Mesh( geometry, swordFireMaterial )
    //     fireMesh.position.x = this.options.x
    //     fireMesh.position.y = this.options.y
    //     fireMesh.position.z = this.options.z

		
	// 	this.fireGlobe = new Mesh( 
	// 		new SphereGeometry(0.2, 6, 6),
	// 		swordFireMaterial.clone()
	// 	) 
	// 	this.fireGlobe.position.x = this.options.x
	// 	this.fireGlobe.position.y = this.options.y
	// 	this.fireGlobe.position.z = this.options.z
	// 	this.fireGroup.add(fireMesh, this.fireGlobe)

    //     // Debug shader material
    //     if (this.debug.active) {
	// 		this.debugFolder.add( this.fireGlobe.material.uniforms.uFlameSpire, 'value').name('fireSpire').min(0).max(1).step(0.001)
	// 		this.debugFolder.add( this.fireGlobe.position, 'y').name('firePositionY').min(0).max(1).step(0.001)
	// 		this.debugFolder.add( this.fireUniform.uStrength, 'value').name('fireStrength').min(0).max(8).step(0.001)
	// 		this.debugFolder.add( this.fireUniform.uStrengthBottom, 'value').name('fireStrength').min(0).max(8).step(0.001)

    //         this.debugFolder.addColor( this.fireUniform.uColor1, 'value').name('fireColor 1').onChange( () => {
    //             this.fireUniform.uColor1.value = this.fireUniform.uColor1.value
    //         })
    //         this.debugFolder.addColor( this.fireUniform.uColor2, 'value').name('fireColor 2').onChange( () => {
    //             this.fireUniform.uColor2.value = this.fireUniform.uColor2.value
    //         })
    //         this.debugFolder.addColor( this.fireUniform.uColor3, 'value').name('fireColor 3').onChange( () => {
    //             this.fireUniform.uColor3.value = this.fireUniform.uColor3.value
    //         })
    //     }
    // }
    update() {
		const time = this.experience.time.elapsed / 1000
        this.fireUniform.uTime.value = time
		this.fireGlobe.material.uniforms.uTime.value = time
    }
}
