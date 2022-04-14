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
        
        this.customUniform = {
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color('#32b859') },
            uColor2: { value: new THREE.Color('#63ca4e') },
        }
        this.materials()
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
    }
    createGrass() {
        const countXY = {
            x: 280,
            y: 280,
        }
        const groundReference = new THREE.PlaneBufferGeometry( 10, 10, countXY.x, countXY.y)
        const count = groundReference.attributes.position.count
        groundReference.rotateX(Math.PI * 0.5)
 
        // start coordinates
        const grass = new THREE.PlaneBufferGeometry(0.02, 0.25, 1, 2)
        grass.translate( 0, 0.125, 0 );
        const instancedGrassMesh = new THREE.InstancedMesh( grass, this.grassMaterial, count );
        
        const dummy = new THREE.Object3D()
        
        for ( let i = 0 ; i < count; i++ ) {
            const scale = 0.5 + Math.random() * 0.5
            dummy.position.set(
                (Math.random() - 0.5) * 10,
                0,
                (Math.random() - 0.5) * 10
            )
            // dummy.scale.setScalar( scale );
            dummy.rotation.y = Math.random() * Math.PI
            dummy.updateMatrix()
            instancedGrassMesh.setMatrixAt( i, dummy.matrix )
        
        }
        
        instancedGrassMesh.instanceMatrix.needsUpdate = true;

        const groundMaterial = new THREE.MeshBasicMaterial({color: '#004400', side: THREE.DoubleSide})
        const groundMesh = new THREE.Mesh(
            groundReference,
            groundMaterial
        )

        /**
         * Debug
         */ 
        // customUniform
        // this.gui.addColor( this.customUniform.uColor1, 'value').onChange( () => {
        //     this.grassMaterial.uniforms.uColor1.value = this.customUniform.uColor1.value
        // })
        // this.gui.addColor( this.customUniform.uColor2, 'value').onChange( () => {
        //     this.grassMaterial.uniforms.uColor2.value = this.customUniform.uColor2.value
        // })
        // gui.add( effectController, 'aperture' ).step(0.001).min(0).max(10).onChange( matChanger )
        // gui.add( effectController, 'maxblur').step(0.001).min(0).max(2).onChange( matChanger )
        // gui.close()

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