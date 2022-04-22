import * as THREE from 'three'
import gsap from 'gsap'

import Experience from '../Experience'

export default class Stones {
    constructor () {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Setup
        this.parameters = {
            radius: 2,
            theta: Math.PI * 0.5,
            yPosition: 2
        }

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Stones')
            // this.debugFolder.close()
        }
        this.generateShape()
    }
    generateShape() {
        // Runes texture
        const runeTexture = this.resources.items.runesTexture
        runeTexture.minFilter = THREE.LinearFilter

        const shape = new THREE.PlaneBufferGeometry( this.parameters.radius, this.parameters.radius )
        const shapeMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide , map: runeTexture, transparent: true })
        shapeMaterial.onBeforeCompile = (shader) => {
            shader.uniforms.uCircle = { value: new THREE.Vector2(0, 0) }
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `
                    uniform vec2 uCircle;
                    #include <common>
                `
            )
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <map_fragment>',
                `
                    vec4 sampledDiffuseColor = texture2D( map, vUv );
                    diffuseColor *= vec4( vec3(0.0, 0.0, 1.0), sampledDiffuseColor.r );
                    diffuseColor.a = (1.0 - sampledDiffuseColor.r);
                    
                    // float circle1 = step(uCircle.x, abs(distance(vUv, vec2(0.5)) - uCircle.y));
                    // float circle2 = distance( vUv, vec2(0.5));
                    
                    // diffuseColor = vec4( vec3(0.0, 0.0, 1.0), 1.0 );
                    // diffuseColor.a = (1.0 - circle1) * (1.0 - sampledDiffuseColor.r);
                `
            )
        }

        const mesh = new THREE.Mesh( shape, shapeMaterial )

        
        mesh.position.y = this.parameters.yPosition
        mesh.rotation.x = Math.PI * 0.5
        

        this.scene.add(mesh)
    }
    animation() { 
        gsap.to(this.stonesGroup.position, {
            keyframes:{
                "50%":{y: '+=0.05', ease:"sine"},
                "100%":{y: '-=0.05', ease:"sine"},
            },
            repeat: -1,
            ease: 'none',
            duration: 1.2
        })
    }
}