import * as dat from 'three/examples/jsm/libs/lil-gui.module.min'
import Stats from 'three/examples/jsm/libs/stats.module'


export default class Debug {
    constructor() {
        this.active = window.location.hash === '#debug'

        if (this.active) {
            this.ui = new dat.GUI()
            this.ui.close()

            this.stats = new Stats()
            document.body.appendChild( this.stats.dom )
        }
    }

    update() {
        if (this.active) {
            this.stats.update()
        }
    }
}