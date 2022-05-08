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
            uColor1: { value: new THREE.Color('#58ad5d') },
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
        const count = 100000
        const size = 12

        // DEFAULTS
        const points = new Float32Array([
            -0.01, 0, 0,
            0.01, 0, 0,
            
            0.01, 0.125, 0,
            -0.01, 0.125, 0,

            0, 0.25, 0,
        ])
        const indeces = [
            0, 1, 2, 
            2, 0, 3,
            3, 2, 4,
        ]
        const uv = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,

            1.0, 0.5,
            0.0, 0.5,
            
            0.5, 1.0
        ])
        const offset = []
        const scales = []
        const rotations = []

        // Transform
        const dummy = new THREE.Object3D()
        const PI = Math.PI

        // Calculation
        let i = 0
        while (i < count) {
        // for ( let i = 0 ; i < count; i++ ) {
            const scale = 0.5 + Math.random() * 0.5

            const r = size * 0.5 * Math.random()
            if( r > 3 ) {
                const theta = Math.random() * 2 * PI
                
                const x = r * Math.cos(theta)
                const z = r * Math.sin(theta)
    
                offset.push( x, 0, z )
                scales.push( scale )
                rotations.push( 
                    (Math.random() - 0.5) * PI * 0.1,
                    (Math.random() - 0.5) * PI
                )
                // increase 
                i++
            }
        }
        // Create grass instance 
        this.grassBufferGeometry = new THREE.InstancedBufferGeometry()
        this.grassBufferGeometry.instanceCount = count
        
        // Apply attributes
        this.grassBufferGeometry.setAttribute('position', new THREE.BufferAttribute(points, 3))
        this.grassBufferGeometry.setIndex( indeces )
        this.grassBufferGeometry.setAttribute('offset', new THREE.InstancedBufferAttribute( new Float32Array( offset ), 3))
        this.grassBufferGeometry.setAttribute('scale', new THREE.InstancedBufferAttribute( new Float32Array( scales ), 1))
        this.grassBufferGeometry.setAttribute('rotation', new THREE.InstancedBufferAttribute( new Float32Array( rotations ), 2))
        this.grassBufferGeometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2) )
    }
    createGrass() {
        const instancedGrassMesh = new THREE.Mesh( this.grassBufferGeometry, this.grassMaterial );
        this.scene.add( instancedGrassMesh )
    }
    update() {
        this.customUniform.uTime.value = this.experience.time.elapsed / 1000
    }
}