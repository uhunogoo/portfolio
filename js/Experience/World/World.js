import { Group } from 'three'
import Experience from '../Experience'
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
        
        const sceneGroup = new Group()
        sceneGroup.name = 'worldGroup'
        
        // Create world
        this.sky = new Skybox()
        this.grass = new Grass()
        this.tower = new Tower()
        this.fire = new Fire()
        this.points = new Createpoints()
        
        // Add all scene group to main 
        sceneGroup.add( 
            this.sky.skyGroup,
            this.sky.cloudsGroup,
            this.grass.grassGroup,
            this.points.pointsGroup,
            this.tower.towerGroup, 
            this.fire.fireGroup
        )
        
        this.scene.add( sceneGroup )
        this.animation = new Animation( sceneGroup )
    }
    resize() {
        if(this.points) {
            this.points.resize()
        }
        if(this.grass) {
            this.grass.resize()
        }
        if(this.animation) {
            this.animation.resize()
        }
    }
    mouseClick() {
        if(this.animation) {
            this.animation.mouseClick()
        }
    }
    deviceOrientation() {
        if(this.animation) {
            this.animation.deviceOrientation()
        }
    }
    mouseMove() {
        if(this.animation) {
            this.animation.mouseMove()
        }
        if(this.sky) {
            this.sky.mouseMove()
        }
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
    }
}
