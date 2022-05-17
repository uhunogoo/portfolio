import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'

import Experience from '../Experience'
import Environment from './Environment'
import Fire from './Fire'
import Grass from './Grass'
import Tower from './Tower'
import Sword from './Sword'
import Skybox from './Skybox'
import Animation from '../Animations/Animations'
import pointsOfInterest from '../Animations/PointsCalculation'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.stats = new Stats()
        document.body.appendChild( this.stats.dom )
        
        const sceneGroup = new THREE.Group()
        sceneGroup.name = 'worldGroup'
        // Wait for environment
        this.resources.on('ready', () => {
            // Setup
            this.sky = new Skybox()
            this.grass = new Grass()
            this.tower = new Tower()
            // this.sword = new Sword()
            this.fire = new Fire()
            sceneGroup.add( this.sky.skyGroup, this.grass.grassGroup, this.tower.towerGroup, this.fire.fireGroup )
            this.scene.add( sceneGroup )
            this.points = new pointsOfInterest()

            
            this.environment = new Environment()
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
        if(this.points) {
            this.points.update()
        }
        this.stats.update()
    }
}