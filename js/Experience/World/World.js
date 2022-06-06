import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'

import Experience from '../Experience'
import Environment from './Environment'
import Fire from './Fire'
import Grass from './Grass'
import Tower from './Tower'
import Skybox from './Skybox'
import Animation from '../Animations/Animations'
import Createpoints from './CreatePoints'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.preload = this.experience.preload
        this.stats = new Stats()
        document.body.appendChild( this.stats.dom )
        
        const sceneGroup = new THREE.Group()
        sceneGroup.name = 'worldGroup'
        // Wait for environment
        this.resources.on('ready', () => {

            // Create world
            this.sky = new Skybox()
            this.grass = new Grass()
            this.tower = new Tower()
            this.fire = new Fire()
            this.points = new Createpoints()
            
            // Add all scene group to main 
            sceneGroup.add( 
                this.sky.skyGroup, 
                this.grass.grassGroup,
                this.points.pointsGroup,
                this.tower.towerGroup, 
                this.fire.fireGroup
            )
            this.scene.add( sceneGroup )

            // this.environment = new Environment()
            this.animation = new Animation( sceneGroup )
        })
    }
    update() {
        if(this.grass) {
            this.grass.update()
        }
        if(this.fire) {
            this.fire.update()
        }
        if(this.animation) {
            this.animation.update()
        }
        if(this.tower) {
            this.tower.update()
        }
        this.stats.update()
    }
}