import * as THREE from 'three'
import gsap from 'gsap'
import Experience from '../Experience'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'

// Grass shaders
import vertexShader from '../../../asstes/shaders/grass/vertexShader.glsl?raw'
import fragmentShader from '../../../asstes/shaders/grass/fragmentShader.glsl?raw'
import particlesVertex from '../../../asstes/shaders/sword/particlesVertex.glsl?raw'
import particlesFragment from '../../../asstes/shaders/sword/particlesFragment.glsl?raw'


export default class Grass {
    constructor () {
        this.experience = new Experience()
        this.grassGroup = new THREE.Group()
        this.sizes = this.experience.sizes
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Parameters
        this.grassParameters = {
            count: 100000,
            size: 11.78
        }
        this.customUniform = {
            uTime: { value: 0 },
            uTexture: { value: this.resources.items.grassTexture },
            uColor1: { value: new THREE.Color('#8f3838') },
            uColor2: { value: new THREE.Color('#ff8800') },
        }
        this.particlesUniform = {
            uTime: { value: 0 },
            uPixelRatio: { value: this.experience.sizes.pixelRatio }
        }      

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Grass')
            this.debugFolder.close()
        }

        this.materials()
        this.createAmbientSparks()
        this.createFloor()
        this.createGrassGeometry()
    }
    percentage() {
        let percentage = ( ( this.sizes.width * 100 ) / 850 ) / 100       
        percentage = gsap.utils.clamp( 0.45, 1, percentage )

        return percentage
    }
    materials () {
        this.grassMaterial = new THREE.ShaderMaterial({
            uniforms: this.customUniform,
            side: THREE.DoubleSide,
            transparent: true,
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
        // Defaults
        const { count } = this.grassParameters
        const sampler = new MeshSurfaceSampler( this.floor ).setWeightAttribute( null ).build()
        
        // resample basic
        const dummy = new THREE.Object3D()
        const _position = new THREE.Vector3()
        const _normal = new THREE.Vector3()

        // DEFAULTS
        const grassParams = {
            points: [
                -0.01, 0, 0,
                0.01, 0, 0,
    
                -0.01, 0.25, 0,
                0.01, 0.25, 0,
            ],
            indeces: [
                1, 0, 2,
                2, 1, 3,
            ],
            uv: [
                0, 0,
                1, 0,

                0, 1,
                1, 1,
            ]

        }
        const offset = []
        const scales = []
        const rotations = []

        // Transform
        const PI = Math.PI

        // Calculation
        const pushGeometryData = (x, z, scale) => {
            // const id = (scale > 0.65) ? 0 : 1
            offset.push( x, 0, z )
            scales.push( scale * 1.1 )
            rotations.push( 
                (Math.random() - 0.5) * PI * 0.1,
                (Math.random() - 0.5) * PI
            )
        }
        

        let i = 0
        while (i < count) {
            sampler.sample( _position, _normal )
            _normal.add( _position )

            dummy.position.copy( _position )
            dummy.lookAt( _normal )
            dummy.updateMatrix()

            // Calculated
            const scale = 0.5 + Math.random() * 0.5
            const { x, y } = dummy.position
            const r = dummy.position.distanceTo( new THREE.Vector3() )
            
            if ( r > 2.05 ) {
                if ( x < 0) {
                    pushGeometryData(x, y, scale)
                        
                    // increase 
                    i++
                } else {
                    const fireArea = (-1.45 > y && y > -2.1 && x > 3.5 && x < 4.15)
                    const stelaArea = (y > 1.3 && y < 1.98 && x > 3.5 && x < 4.15)
                    
                    if (y < -0.7 && !fireArea) { 
                        pushGeometryData(x, y, scale)

                        // increase 
                        i++
                    } else if (y > 0.7 && !stelaArea) {
                        pushGeometryData(x, y, scale)

                        // increase 
                        i++
                    }
                        
                }
            }

        }

        // Create grass instance      
        this.grassBufferGeometry = new THREE.InstancedBufferGeometry()
        this.grassBufferGeometry.instanceCount =  Math.round( count * this.percentage() )

        // Apply attributes
        this.grassBufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(grassParams.points, 3))
        this.grassBufferGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(grassParams.uv, 2) )
        this.grassBufferGeometry.setIndex( grassParams.indeces )

        this.grassBufferGeometry.setAttribute('rotation', new THREE.InstancedBufferAttribute( new Float32Array( rotations ), 2))
        this.grassBufferGeometry.setAttribute('offset', new THREE.InstancedBufferAttribute( new Float32Array( offset ), 3))
        this.grassBufferGeometry.setAttribute('scale', new THREE.InstancedBufferAttribute( new Float32Array( scales ), 1))

        const instancedGrassMesh = new THREE.Mesh( this.grassBufferGeometry, this.grassMaterial )
        
        // Bounding sphere for frustumculled 
        instancedGrassMesh.geometry.computeBoundingSphere()
        instancedGrassMesh.geometry.boundingSphere.radius = this.grassParameters.size * 0.5

        this.grassGroup.add( instancedGrassMesh )
    }
    createAmbientSparks() {
        // Particles defaults
        const count = 50
        const PI = Math.PI
        const offset = []
        const speed = []
        let i = 0

        // Generate particles around the sword
        const ambientParticlesMaterial = new THREE.ShaderMaterial({
            uniforms: this.particlesUniform,
            transparent: true,
            depthWrite: false,
            vertexShader: particlesVertex,
            fragmentShader: particlesFragment
        })

        while (i < count) {
            const r = this.grassParameters.size * 0.5 * Math.random()
            const theta = Math.random() * 2 * PI
            if( r > 2.05 ) {
                const x = r * Math.cos(theta)
                const z = r * Math.sin(theta)
                offset.push( x, Math.random() * 0.5, z )
                speed.push( (0.2 + Math.random() ) / 1.2 )
                
                // increase 
                i++
            }
        }
        
        
        this.particlesBufferGeometry = new THREE.BufferGeometry()
        this.particlesBufferGeometry.instanceCount = count
        this.particlesBufferGeometry.setAttribute('position', new THREE.BufferAttribute( new Float32Array( offset ), 3))
        this.particlesBufferGeometry.setAttribute('vSpeed', new THREE.BufferAttribute( new Float32Array( speed ), 1))

        const instancedParticlesMesh = new THREE.Points( this.particlesBufferGeometry, ambientParticlesMaterial )
        instancedParticlesMesh.position.y = 0.6
        
        this.grassGroup.add( instancedParticlesMesh )
    }
    createFloor() {
        const floorGeometry = new THREE.CircleGeometry( this.grassParameters.size * 0.5, 80, 0, Math.PI * 2 ).toNonIndexed()

        this.resources.items.sandTexture.encoding = THREE.sRGBEncoding
        this.resources.items.sandTexture.wrapS = THREE.RepeatWrapping
        this.resources.items.sandTexture.wrapT = THREE.RepeatWrapping
        this.resources.items.sandTexture.repeat.set(20, 20)

        const floorMaterial = new THREE.MeshBasicMaterial({
            map: this.resources.items.sandTexture
        })
        floorMaterial.onBeforeCompile = (shader) => {

            shader.uniforms.uColor1 = { value: new THREE.Color('#b76e2a') }
            shader.uniforms.uColor2 = { value: new THREE.Color('#864a18') }

            if (this.debug.active) {
                this.debugFolder
                    .addColor( this.customUniform.uColor1, 'value')
                    .name('color1')
                    .onChange( () => {
                        shader.uniforms.uColor1.value = this.customUniform.uColor1.value
                    })
                this.debugFolder
                    .addColor( this.customUniform.uColor2, 'value')
                    .name('color2')
                    .onChange( () => {
                        shader.uniforms.uColor2.value = this.customUniform.uColor2.value
                    })
            }
            
            // Add uniforms  
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `#include <common>
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                `
            )
            
            // Custom fragmentShader
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <dithering_fragment>',
                `
                    #include <dithering_fragment>

                    // Calculate road shadow
                    float rect = length(vUv.y - 9.95);
                    rect = smoothstep(1.1, 1.4, rect);
                    rect = (1.0 - step(0.5, vUv.x - 10.0)) + rect;
                    rect = clamp(rect, 0.0, 1.0);

                    float grey = (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.0;
                    grey = 0.3 / grey - 0.6;
                    
                    vec3 color;
                    color = vec3( sin( grey * 20.0 ) );
                    color = mix( uColor2, uColor1, grey);
                    color = clamp(color, vec3(0.0), vec3(1.0));
                    

                    gl_FragColor.rgb = vec3(mix(color * 0.6, color, rect));
                `
            )
        }
        
        this.floor = new THREE.Mesh(
            floorGeometry,
            floorMaterial
        )

        // Transform
        this.floor.rotation.x = -Math.PI / 2

        this.grassGroup.add( this.floor )
    }
    resize() {
        this.grassBufferGeometry.instanceCount = Math.round( this.grassParameters.count * this.percentage() )     
    }
    update() {
        const time = this.experience.time.elapsed / 1000
        this.customUniform.uTime.value = time
        this.particlesUniform.uTime.value = time
    }
}