import { BufferAttribute, BufferGeometry, CircleGeometry, Color, DoubleSide, Float32BufferAttribute, Group, InstancedBufferAttribute, InstancedBufferGeometry, Mesh, MeshBasicMaterial, Object3D, Points, RepeatWrapping, ShaderMaterial, sRGBEncoding, Vector2, Vector3 } from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import Experience from '../Experience'
import gsap from 'gsap'

// Grass shaders
import vertexShader from '../../../asstes/shaders/grass/vertexShader.glsl?raw'
import fragmentShader from '../../../asstes/shaders/grass/fragmentShader.glsl?raw'
import particlesVertex from '../../../asstes/shaders/sword/particlesVertex.glsl?raw'
import particlesFragment from '../../../asstes/shaders/sword/particlesFragment.glsl?raw'


export default class Grass {
    constructor () {
        this.experience = new Experience()
        this.grassGroup = new Group()
        this.sizes = this.experience.sizes
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Parameters
        this.grassParameters = {
            count: 100000,
            size: 11.78
        }
        this.resources.items.shadowMap.flipY = false
        this.customUniform = {
            uHeight: { value: 0.5 },
            uIntesity: { value: 0.38 },
            uTime: { value: 0 },
            uTexture: { value: this.resources.items.grassTexture },
            uShadows: { value: this.resources.items.shadowMap },
            uShadowVec: { value: new Vector2(0.042, 0.042) },
            uColor1: { value: new Color('#8f3838') },
            uColor2: { value: new Color('#ff8800') },
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
        this.grassMaterial = new ShaderMaterial({
            uniforms: this.customUniform,
            side: DoubleSide,
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
            this.debugFolder
                .add( this.customUniform.uHeight, 'value')
                .min(0)
                .max(1)
                .name('grassHeight')
            this.debugFolder
                .add( this.customUniform.uShadowVec.value, 'x')
                .min(-1)
                .max(1)
                .name('shadowX')
            this.debugFolder
                .add( this.customUniform.uShadowVec.value, 'y')
                .min(-1)
                .max(1)
                .name('shadowY')
            this.debugFolder
                .add( this.customUniform.uIntesity, 'value')
                .min(0)
                .max(1)
                .name('grassIntesity')
        }
    }
    createGrassGeometry() {
        // Defaults
        const { count } = this.grassParameters
        const sampler = new MeshSurfaceSampler( this.floor ).setWeightAttribute( null ).build()
		sampler.geometry.scale( 0.46, 0.47, 0.47 )
        
        // resample basic
        const dummy = new Object3D()
        const _position = new Vector3()
        const _normal = new Vector3()

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
            offset.push( x, 0, z )
            scales.push( scale * 1.2 )
            rotations.push( 
                (Math.random() - 0.5) * PI * 0.1,
                (Math.random() - 0.5) * PI
            )
        }
		
		// Generate grass
		for (let i = 0; i < count; i++ ) {
			sampler.sample( _position, _normal )
			_normal.add( _position )

			// Dummy object
			dummy.position.copy( _position )
			dummy.lookAt( _normal )
			dummy.updateMatrix()
			
			// Calculated
			const scale = 0.5 + Math.random() * 0.5
			const { x, z } = dummy.position
			
			// Set parameters
			pushGeometryData(x, z, scale)
		}

        // Create grass instance      
        this.grassBufferGeometry = new InstancedBufferGeometry()
        this.grassBufferGeometry.instanceCount =  Math.round( count * this.percentage() )

        // Apply attributes
        this.grassBufferGeometry.setAttribute('position', new Float32BufferAttribute(grassParams.points, 3))
        this.grassBufferGeometry.setAttribute('uv', new Float32BufferAttribute(grassParams.uv, 2) )
        this.grassBufferGeometry.setIndex( grassParams.indeces )

        this.grassBufferGeometry.setAttribute('rotation', new InstancedBufferAttribute( new Float32Array( rotations ), 2))
        this.grassBufferGeometry.setAttribute('offset', new InstancedBufferAttribute( new Float32Array( offset ), 3))
        this.grassBufferGeometry.setAttribute('scale', new InstancedBufferAttribute( new Float32Array( scales ), 1))

        const instancedGrassMesh = new Mesh( this.grassBufferGeometry, this.grassMaterial )
        
        // Bounding sphere for frustumculled 
        instancedGrassMesh.geometry.computeBoundingSphere()
        instancedGrassMesh.geometry.boundingSphere.radius = this.grassParameters.size * 0.5

        this.grassGroup.add( instancedGrassMesh )
    }
    createAmbientSparks() {
        // Particles defaults
        const count = 100
        const PI = Math.PI
        const offset = []
        const speed = []
        let i = 0

        // Generate particles around the sword
        const ambientParticlesMaterial = new ShaderMaterial({
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
        
        
        this.particlesBufferGeometry = new BufferGeometry()
        this.particlesBufferGeometry.instanceCount = count
        this.particlesBufferGeometry.setAttribute('position', new BufferAttribute( new Float32Array( offset ), 3))
        this.particlesBufferGeometry.setAttribute('vSpeed', new BufferAttribute( new Float32Array( speed ), 1))

        const instancedParticlesMesh = new Points( this.particlesBufferGeometry, ambientParticlesMaterial )
        instancedParticlesMesh.position.y = 0.6
        
        this.grassGroup.add( instancedParticlesMesh )
    }
    createFloor() {
		const towerScene = this.resources.items.towerModel.scene
        const floorGeometry = towerScene.children.find((child) => child.name === 'ground')
		floorGeometry.scale.setScalar(0.47)
		floorGeometry.geometry.computeVertexNormals()
		console.log( floorGeometry )
		
        this.resources.items.sandTexture.wrapS = RepeatWrapping
        this.resources.items.sandTexture.wrapT = RepeatWrapping
        this.resources.items.sandTexture.repeat.set(20, 20)

        const floorMaterial = new MeshBasicMaterial({
            map: this.resources.items.sandTexture,
        })
        floorMaterial.onBeforeCompile = (shader) => {

            shader.uniforms.uFloorColor1 = { value: new Color('#b76e2a') }
            shader.uniforms.uFloorColor2 = { value: new Color('#864a18') }

            if (this.debug.active) {
                this.debugFolder
                    .addColor( shader.uniforms.uFloorColor1, 'value')
                    .name('color1')
                    .onChange( () => {
                        shader.uniforms.uFloorColor1.value = this.customUniform.uFloorColor1.value
                    })
                this.debugFolder
                    .addColor( shader.uniforms.uFloorColor2, 'value')
                    .name('color2')
                    .onChange( () => {
                        shader.uniforms.uFloorColor2.value = this.customUniform.uFloorColor2.value
                    })
            }
            
            // Add uniforms  
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `#include <common>
                uniform vec3 uFloorColor1;
                uniform vec3 uFloorColor2;
				mat2 get2dRotateMatrix(float _angle){
					return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));
				}
                `
            )
            
            // Custom fragmentShader
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <dithering_fragment>',
                `
                    #include <dithering_fragment>

                    // Calculate road shadow
					vec2 newUV = (vUv - 10.0) * get2dRotateMatrix(3.14 * 0.217) + 10.0;
                    float rect = length(newUV.y - 9.95);
                    rect = smoothstep(1.0, 1.25, rect);
                    rect = step(0.5, newUV.x - 10.0) + rect;
                    rect = clamp(rect, 0.0, 1.0);

                    float grey = (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.0;
                    grey = 0.3 / grey - 0.6;
                    
                    vec3 color;
                    color = vec3( sin( grey * 20.0 ) );
                    color = mix( uFloorColor2, uFloorColor1, grey);
                    color = vec3( 1.0, 0.413, 0.232 ) - grey;
                    

                    gl_FragColor.rgb = vec3( mix(color * 0.5, color * 0.8, rect) );
                    #if defined( TONE_MAPPING )
                        gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
                    #endif
                `
            )
        }
        
        this.floor = floorGeometry
        this.floor.material = floorMaterial

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
