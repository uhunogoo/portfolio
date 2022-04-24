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
        // Wood
        this.resources.items.woodTexture.encoding = THREE.sRGBEncoding
        this.resources.items.woodTexture.repeat.set(0.25, 0.25)
        this.resources.items.woodTexture.wrapS = THREE.RepeatWrapping
        this.resources.items.woodTexture.wrapT = THREE.RepeatWrapping
        
        this.resources.items.woodTextureRoughness.repeat.set(0.25, 0.25)
        this.resources.items.woodTextureRoughness.wrapS = THREE.RepeatWrapping
        this.resources.items.woodTextureRoughness.wrapT = THREE.RepeatWrapping
        
        
        // Gold
        this.resources.items.goldTexture.encoding = THREE.sRGBEncoding
        this.resources.items.goldTexture.repeat.set(0.25, 0.25)
        this.resources.items.goldTexture.wrapS = THREE.RepeatWrapping
        this.resources.items.goldTexture.wrapT = THREE.RepeatWrapping
        
        this.resources.items.goldTextureNormal.repeat.set(0.25, 0.25)
        this.resources.items.goldTextureNormal.wrapS = THREE.RepeatWrapping
        this.resources.items.goldTextureNormal.wrapT = THREE.RepeatWrapping
        
        this.resources.items.goldTextureRoughness.repeat.set(0.25, 0.25)
        this.resources.items.goldTextureRoughness.wrapS = THREE.RepeatWrapping
        this.resources.items.goldTextureRoughness.wrapT = THREE.RepeatWrapping

        // Metal        
        this.resources.items.metalTextureNormal.repeat.set(1.12, 1.12)
        this.resources.items.metalTextureNormal.wrapS = THREE.RepeatWrapping
        this.resources.items.metalTextureNormal.wrapT = THREE.RepeatWrapping
        
        this.resources.items.metalTextureRoughness.repeat.set(1.12, 1.12)
        this.resources.items.metalTextureRoughness.wrapS = THREE.RepeatWrapping
        this.resources.items.metalTextureRoughness.wrapT = THREE.RepeatWrapping


        // Create materials
        this.metalMaterial = new THREE.MeshStandardMaterial({
            color: '#ffffff',
            roughness: 1,
            roughnessMap: this.resources.items.metalTextureRoughness,
            normalMap: this.resources.items.metalTextureNormal,
            metalness: 0.0
        })

        this.woodMaterial = new THREE.MeshStandardMaterial({
            roughness: 1,
            metalness: 0.2,
            roughnessMap: this.resources.items.woodTextureRoughness,
            map: this.resources.items.woodTexture
        })

        this.goldMaterial = new THREE.MeshStandardMaterial({
            roughness: 0.6,
            metalness: 0.6,
            map: this.resources.items.goldTexture,
            roughnessMap: this.resources.items.goldTextureRoughness,
            normalMap: this.resources.items.goldTextureNormal,
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

        garda.castShadow = true
        garda.receiveShadow = true
        knife.castShadow = true
        knife.receiveShadow = true
        handle.castShadow = true
        handle.receiveShadow = true

        // Group parameters
        this.group.add(knife, handle, garda)
        this.group.scale.set(0.3, 0.3, 0.3)
        this.group.position.y = 2
        this.group.rotation.y = Math.PI


        this.scene.add( this.group )
    }
    animation() {
        gsap.set(this.group.position, {y: '-=0.1'})
        const tl = gsap.timeline({
            repeat: -1,
            defaults: {
                ease: 'power3.inOut',
                duration: 0.8,
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