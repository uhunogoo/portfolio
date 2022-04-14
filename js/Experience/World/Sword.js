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
        this.metalMaterial = new THREE.MeshStandardMaterial({
            color: '#e5e5e5',
            roughness: 1,
            roughnessMap: this.resources.items.metalTextureRoughness,
            normalMap: this.resources.items.metalTextureNormal,
            metalness: 0.4
        })
        this.metalMaterial.generateMipmaps = false
        this.metalMaterial.minFilter = THREE.NearestFilter

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

        // Group parameters
        this.group.add(knife, handle, garda)
        this.group.scale.set(0.3, 0.3, 0.3)
        this.group.position.y = 1.8


        this.scene.add( this.group )
    }
    animation() {
        const tl = gsap.timeline({
            repeat: -1,
            yoyo: true,
            defaults: {
                ease: 'power1.inOut',
                duration: 0.4,
            }
        })
        tl.to(this.group.position, {
            y: '+=0.12'
        })
    }
}