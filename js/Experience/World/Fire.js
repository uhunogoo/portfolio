import * as THREE from 'three'
import Experience from '../Experience'

// Sword shaders
import swordParticlesVertex from '../../../asstes/shaders/sword/particlesVertex.glsl?raw'
import swordParticlesFragment from '../../../asstes/shaders/sword/particlesFragment.glsl?raw'
import swordFireVertex from '../../../asstes/shaders/sword/fireVertex.glsl?raw'
import swordFireFragment from '../../../asstes/shaders/sword/fireFragment.glsl?raw'

export default class Fire {
    constructor() {
        this.experience = new Experience()
        this.fireGroup = new THREE.Group()
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
        this.options.y = 2.7
        this.fireUniform = {
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color('#1e00ff') },
            uColor2: { value: new THREE.Color('#00bfff') },
            uColor3: { value: new THREE.Color('#f5d0d0') },
        }
        this.particlesUniform = {
            uTime: { value: 0 },
            uPixelRatio: { value: this.sizes.pixelRatio }
        }

        this.createFire()
    }
    createFire() {
        // Shape around te sword
        const geometry = new THREE.CylinderBufferGeometry(0.4, 0.15, 0.5, 10, 10)

        // Generate particles around the sword
        const swordParticlesMaterial = new THREE.ShaderMaterial({
            uniforms: this.particlesUniform,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexShader: swordParticlesVertex,
            fragmentShader: swordParticlesFragment
        })
        
        const particlesMesh = new THREE.Points( geometry, swordParticlesMaterial )
        particlesMesh.position.y = this.options.y
        
        // Generate fire around the sword
        // const fireGeometry
        const swordFireMaterial = new THREE.ShaderMaterial({
            uniforms: this.fireUniform,
            transparent: true,
            side: THREE.DoubleSide,
            vertexShader: swordFireVertex,
            fragmentShader: swordFireFragment
        })
        const fireMesh = new THREE.Mesh( geometry, swordFireMaterial )
        fireMesh.position.y = this.options.y

        this.fireGroup.add(particlesMesh, fireMesh)

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
        this.particlesUniform.uTime.value = this.experience.time.elapsed / 1000
        this.fireUniform.uTime.value = this.experience.time.elapsed / 1000
    }
}