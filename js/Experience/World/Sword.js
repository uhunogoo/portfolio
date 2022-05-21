import * as THREE from 'three'
import gsap from 'gsap'
import Experience from '../Experience'

export default class Sword {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.loadMaterials()
        this.createSword()

        this.animation()
    }
    loadMaterials() {


        // Create materials
        this.metalMaterial = new THREE.MeshBasicMaterial({
            color: '#e5e5e5',
        })

        this.woodMaterial = new THREE.MeshStandardMaterial({
            roughness: 1,
            metalness: 0.2,
            color: '#ffeeee'
        })

        this.goldMaterial = new THREE.MeshStandardMaterial({
            roughness: 0.6,
            metalness: 0.6,
            color: '#ff00ff'
        })
        
    }
    
    createSword() {
        this.group = new THREE.Group()
        this.sword = this.resources.items.swordModel
        
        // Find child instance
        const garda = this.sword.scene.children.find( child => child.name === 'golden')
        const knife = this.sword.scene.children.find( child => child.name === 'rock')
        const handle = this.sword.scene.children.find( child => child.name === 'handle')

        // Apply materials to geometry
        garda.material = this.goldMaterial.clone()
        knife.material = this.metalMaterial.clone()
        handle.material = this.woodMaterial.clone()

        // garda.castShadow = true
        // garda.receiveShadow = true
        // knife.castShadow = true
        // knife.receiveShadow = true
        // handle.castShadow = true
        // handle.receiveShadow = true

        // Group parameters
        this.group.add(knife, handle, garda)
        this.group.scale.setScalar( 0.25 )
        this.group.position.y = 2.4
        this.group.rotation.y = Math.PI * 0.5


        this.scene.add( this.group )
    }
    animation() {
        gsap.set(this.group.position, {y: '-=0.1'})
        const tl = gsap.timeline({
            repeat: -1,
            defaults: {
                ease: 'power3.inOut',
                duration: 1.2,
            }
        })
        tl.to(this.group.position, {
            keyframes:{
                "50%":{y: '+=0.1', ease:"sine"},
                "100%":{y: '-=0.1', ease:"sine"},
            },
        })
    }
}