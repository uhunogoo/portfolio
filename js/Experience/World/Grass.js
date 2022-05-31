import * as THREE from 'three'
import Experience from '../Experience'

// Grass shaders
import vertexShader from '../../../asstes/shaders/grass/vertexShader.glsl?raw'
import fragmentShader from '../../../asstes/shaders/grass/fragmentShader.glsl?raw'


export default class Grass {
    constructor () {
        this.experience = new Experience()
        this.grassGroup = new THREE.Group()
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Parameters
        this.grassParameters = {
            count: 40000,
            size: 11.6
        }
        this.customUniform = {
            uTime: { value: 0 },
            uRotate: { value: 0.2 },
            uColor1: { value: new THREE.Color('#d4a268') },
            uColor2: { value: new THREE.Color('#533f28') },
        }

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Grass')
            this.debugFolder.close()
        }

        this.materials()
        this.createGrassGeometry()
        this.createGrass()
        this.createFloor()
    }
    materials () {
        this.grassMaterial = new THREE.ShaderMaterial({
            uniforms: this.customUniform,
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
            this.debugFolder
                .add(this.grassMaterial.uniforms.uRotate, 'value')
                .name('grassRotation')
                .min(-1)
                .max(1)
                .step(0.001)
        }
    }
    createGrassGeometry() {
        const {size, count} = this.grassParameters

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
        const PI = Math.PI

        // Calculation
        let i = 0
        while (i < count) {
        // for ( let i = 0 ; i < count; i++ ) {
            const scale = 0.5 + Math.random() * 0.5

            const r = size * 0.5 * Math.random()
            if( r > 2 ) {
                const theta = Math.random() * 2 * PI
                
                const x = r * Math.cos(theta)
                const z = r * Math.sin(theta)
                if ( x < 0) {
                    offset.push( x, 0, z )
                    scales.push( scale )
                    rotations.push( 
                        (Math.random() - 0.5) * PI * 0.1,
                        (Math.random() - 0.5) * PI
                    )
                    // increase 
                    i++
                } else {
                    if (z < -0.7) { 
                        offset.push( x, 0, z )
                        scales.push( scale )
                        rotations.push( 
                            (Math.random() - 0.5) * PI * 0.1,
                            (Math.random() - 0.5) * PI
                        )
                        // increase 
                        i++
                    } else if (z > 0.7) {
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
    createFloor() {
        const floorGeometry = new THREE.CircleBufferGeometry( this.grassParameters.size * 0.5, 80, 0, Math.PI * 2 )
        
        this.resources.items.sandTexture.encoding = THREE.sRGBEncoding
        this.resources.items.sandTexture.repeat.set(6, 6)
        this.resources.items.sandTexture.wrapS = THREE.RepeatWrapping
        this.resources.items.sandTexture.wrapT = THREE.RepeatWrapping

        const floorMaterial = new THREE.MeshBasicMaterial({
            map: this.resources.items.sandTexture
        })
        
        const floor = new THREE.Mesh(
            floorGeometry,
            floorMaterial
        )

        // Transform
        floor.rotation.x = -Math.PI / 2

        this.grassGroup.add( floor )
    }
    createGrass() {
        const instancedGrassMesh = new THREE.Mesh( this.grassBufferGeometry, this.grassMaterial )
        
        // Bounding sphere for frustumculled 
        instancedGrassMesh.geometry.computeBoundingSphere()
        instancedGrassMesh.geometry.boundingSphere.radius = this.grassParameters.size * 0.5
        
        this.grassGroup.add( instancedGrassMesh )
    }
    update() {
        this.customUniform.uTime.value = this.experience.time.elapsed / 1000
    }
}