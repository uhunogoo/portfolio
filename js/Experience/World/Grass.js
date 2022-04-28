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
            uColor1: { value: new THREE.Color('#32b859') },
            uColor2: { value: new THREE.Color('#63ca4e') },
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
        const poisnts = new Float32Array([
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
        const indeces = [
            0, 1, 2, 
            2, 0, 3,
            3, 2, 4,
            4, 3, 5,
        ]

        this.grassBufferGeometry = new THREE.BufferGeometry()
        this.grassBufferGeometry.setAttribute('position', new THREE.BufferAttribute(poisnts, 3))
        this.grassBufferGeometry.setIndex( indeces )
        this.grassBufferGeometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2) )
    }
    createGrass() {
        const count = 100000
        const size = 10
        const countXY = {
            x: 300,
            y: 300,
        }
        const groundPoints = new THREE.Float32BufferAttribute(count * 3, 3)

        const groundReference = new THREE.PlaneBufferGeometry( size, size, countXY.x, countXY.y)
        groundReference.rotateX(Math.PI * 0.5)


        const instancedGrassMesh = new THREE.InstancedMesh( this.grassBufferGeometry, this.grassMaterial, count );
        
        const dummy = new THREE.Object3D()
        const PI = Math.PI

        for ( let i = 0 ; i < count; i++ ) {
            const scale = 0.5 + Math.random() * 0.5

            const r = size * 0.5* Math.sqrt(Math.random())
            const theta = Math.random() * 2 * PI

            const x = 0 + r * Math.cos(theta)
            const z = 0 + r * Math.sin(theta)

            dummy.position.set(
                x,
                0,
                z
            )
            groundPoints.setXYZ(i, x, 0, z)

            dummy.scale.setScalar( scale + 0.4 );
            dummy.rotation.y = Math.random() * Math.PI
            dummy.updateMatrix()
            instancedGrassMesh.setMatrixAt( i, dummy.matrix )
        
        }
        instancedGrassMesh.instanceMatrix.needsUpdate = true
        const ground = new THREE.BufferGeometry()
        ground.setAttribute('position', groundPoints)

        

        const groundMaterial = new THREE.MeshBasicMaterial({color: '#004400', side: THREE.DoubleSide})
        const groundMesh = new THREE.Mesh(
            ground,
            groundMaterial
        )
        

        // ground deformation
        groundMaterial.onBeforeCompile = (shader) => {
            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                `
                    #include <begin_vertex>
                    transformed.y = (1.0 - smoothstep( 0.0, 3.5, length( transformed.xz * 0.5) )) * 1.5;
                `
            )
        }

        this.scene.add( instancedGrassMesh, groundMesh )
        
    }
    update() {
        this.customUniform.uTime.value = this.experience.time.elapsed / 1000
    }
}