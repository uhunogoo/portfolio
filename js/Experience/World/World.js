import Experience from '../Experience'
import Environment from './Environment'
import Fire from './Fire'
import Grass from './Grass'
import Stones from './Runes'
import Sword from './Sword'
import Skybox from './Skybox'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        // Wait for environment
        this.resources.on('ready', () => {
            // Setup
            this.sky = new Skybox()
            this.grass = new Grass()
            this.sword = new Sword()
            this.fire = new Fire()
            this.stones = new Stones()
            
            this.environment = new Environment()
        })
    }
    update() {
        if(this.grass) {
            this.grass.update()
        }
        if(this.fire) {
            this.fire.update()
        }
        if(this.sky) {
            this.sky.update()
        }
    }
}