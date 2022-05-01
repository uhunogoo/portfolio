import * as THREE from 'three'
import Experience from '../Experience'

// Grass shaders
import vertexShader from '../../../asstes/shaders/grass/vertexShader.glsl?raw'
import fragmentShader from '../../../asstes/shaders/grass/fragmentShader.glsl?raw'


export default class Grass {
    constructor () {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Grass')
            this.debugFolder.close()
        }
        
        this.customUniform = {
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color('#63c569') },
            uColor2: { value: new THREE.Color('#285332') },
        }
        this.materials()
        this.createGrassGeometry()
        this.createGrass()
    }
    materials () {
        this.grassMaterial = new THREE.ShaderMaterial({
            uniforms: this.customUniform,
            transparent: true,
            side: THREE.DoubleSide,
            vertexShader,
            fragmentShader,
        })

        if (this.debug.active) {
            this.debugFolder
                .addColor( this.customUniform.uColor1, 'value')
                .name('color1')
                .onChange( () => {
                    this.grassMaterial.uniforms.uColor1.value = this.customUniform.uColor1.value
                })
            this.debugFolder
                .addColor( this.customUniform.uColor2, 'value')
                .name('color2')
                .onChange( () => {
                    this.grassMaterial.uniforms.uColor2.value = this.customUniform.uColor2.value
                })
        }
    }
    createGrassGeometry() {
        const count = 90000
        const size = 10

        // DEFAULTS
        const points = new Float32Array([
            -0.01, 0, 0,
            0.01, 0, 0,
            
            0.01, 0.125, 0,
            -0.01, 0.125, 0,

            0, 0.25, 0,
        ])
        const uv = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,

            1.0, 0.5,
            0.0, 0.5,
            
            0.5, 1.0
        ])
        const offset = []

        // Transform
        const dummy = new THREE.Object3D()
        const PI = Math.PI

        for ( let i = 0 ; i < count; i++ ) {
            const scale = 0.5 + Math.random() * 0.5

            const r = size * 0.5* Math.sqrt(Math.random())
            const theta = Math.random() * 2 * PI

            const x = 0 + r * Math.cos(theta)
            const z = 0 + r * Math.sin(theta)

            offset.push( x, 0, z )

            // dummy.scale.setScalar( scale );
            // dummy.rotation.x = (Math.random() - 0.5) * PI * 0.1
            // dummy.rotation.y = (Math.random() - 0.5) * PI
            // dummy.updateMatrix()
        }
        console.log(offset)

        this.grassBufferGeometry = new THREE.InstancedBufferGeometry()
        this.grassBufferGeometry.instanceCount = count
        
        this.grassBufferGeometry.setAttribute('offset', new THREE.InstancedBufferAttribute( new Float32Array( points ), 3))
        this.grassBufferGeometry.setAttribute('position', new THREE.BufferAttribute(points, 3))
        // this.grassBufferGeometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2) )
    }
    createGrass() {
        const instancedGrassMesh = new THREE.Mesh( this.grassBufferGeometry, this.grassMaterial );
        this.scene.add( instancedGrassMesh )
    }
    update() {
        this.customUniform.uTime.value = this.experience.time.elapsed / 1000
    }
}