import { CylinderGeometry, Group, Mesh, MeshBasicMaterial, PlaneBufferGeometry, Vector3 } from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky'
import Experience from '../Experience'
import gsap from 'gsap'


export default class Skybox {
    constructor() {
        this.experience = new Experience()
        this.skyGroup = new Group()
        this.cloudsGroup = new Group()
        this.cloudsGroup.name = 'cloudsGroup'
        this.renderer = this.experience.renderer
        this.camera = this.experience.camera
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        // Defaults
        this.parameters = {
            timescale: 1
        }

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Sky')
            this.debugFolder.close()
        }

        this.degToRad = (a) => {
            return a * Math.PI / 180
        }

        this.createSky()
        this.createClouds()
    }
    createSky() {
        // Add Sky
        const that = this
        const sky = new Sky()
		sky.geometry = new CylinderGeometry(0.5, 0.5, 1, 10, 10)
        sky.scale.setScalar( 15)
        this.skyGroup.add( sky )

        const sun = new Vector3()

        /// GUI
        const effectController = {
            // NEW v1
            // **************************
            turbidity: 13.116,
            rayleigh: 0.066,
            mieCoefficient: 0.007,

            // NEW v2
            // **************************
            // turbidity: 3.036,
            // rayleigh: 0.607,
            // mieCoefficient: 0.064,
            // mieDirectionalG: 0.975,
            // elevation: 11.45,
            // azimuth: 87.068,

            // OLD
            // **************************
            // turbidity: 2.299,
            // rayleigh: 0.411,
            // mieCoefficient: 0.1,
            
            mieDirectionalG: 0.975,
            elevation: 90,
            azimuth: 180,
            exposure: this.renderer.instance.toneMappingExposure
        }

        function guiChanged() {
            const uniforms = sky.material.uniforms
            uniforms[ 'turbidity' ].value = effectController.turbidity
            uniforms[ 'rayleigh' ].value = effectController.rayleigh
            uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient
            uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG

            const phi = that.degToRad( 90 - effectController.elevation )
            const theta = that.degToRad( effectController.azimuth )
            sun.setFromSphericalCoords( 1, phi, theta )

            uniforms[ 'sunPosition' ].value.copy( sun )

            that.renderer.instance.toneMappingExposure = effectController.exposure
        }
        
        guiChanged()

        if (this.debug.active) {
            this.debugFolder.add( effectController, 'turbidity').min(0).max(20).step(0.001).onChange( guiChanged )
            this.debugFolder.add( effectController, 'rayleigh').min(0).max(4).step(0.001).onChange( guiChanged )
            this.debugFolder.add( effectController, 'mieCoefficient').min(0).max(0.1).step(0.001).onChange( guiChanged )
            this.debugFolder.add( effectController, 'mieDirectionalG').min(0).max(1).step(0.001).onChange( guiChanged )
            this.debugFolder.add( effectController, 'elevation').min(0).max(90).step(0.001).onChange( guiChanged )
            this.debugFolder.add( effectController, 'azimuth').min(-180).max(180).step(0.001).onChange( guiChanged )
            this.debugFolder.add( effectController, 'exposure').min(0).max(2).step(0.001).onChange( guiChanged )
        }
    }
    createClouds() {
        const cloudsParameters = {
            count: 30,
            size: 25
        }
        
        const images = [
            this.resources.items.cloud,
            this.resources.items.cloud2
        ]
        const geometry = new PlaneBufferGeometry( 1, 1 )
        const material = new MeshBasicMaterial({ transparent: true, depthWrite: false })

        // Generate clouds
        for (let i = 0; i < cloudsParameters.count; i++) {
            const cloudTexture = material.clone()
            
            cloudTexture.map = images[ i % 2 ]

            const cloud = new Mesh( 
                geometry.clone(), 
                cloudTexture
            )

            // Cloud parameters
            cloud.position.set(
                (Math.random() - 0.5) * cloudsParameters.size * 2,
                2.5 + Math.random() * cloudsParameters.size * 0.4,
                Math.random() * 6.0 * -1.0
            )
            let scale = cloud.position.y / (cloudsParameters.size * 0.6)
            cloud.scale.set( 
                (1.0 + Math.random()) * 2 + scale * 1.5, 
                0.5 + Math.random() * 0.5 + scale, 
                0 
            )

            this.cloudsGroup.add(cloud)
        }
        // Clouds global parameters
        this.cloudsGroup.position.z = -6.25

        // Animate clouds
        const positiontoanimate = this.cloudsGroup.children.map( cloud => cloud.position )
        this.cloudsAnimation = gsap.timeline({
            paused: true,
            repeat: -1,
            defaults: {
                duration: 20, 
                ease: "none",
            }
        })
        this.cloudsAnimation.to(positiontoanimate, {
            x: "+=" + cloudsParameters.size * 2,
            modifiers: {
              x: gsap.utils.wrap(-cloudsParameters.size, cloudsParameters.size)
            }
        })
        this.cloudsAnimation.play()
    }
    mouseMove() {
        // if (!this.cloudsAnimation) return

        // const tl = gsap.timeline({
        //     onUpdate: () => this.cloudsAnimation.timeScale(this.parameters.timescale),
        //     defaults: {
        //         ease: 'power1.out',
        //         duration: 1.5,
        //     }
        // })
        // tl.to( this.parameters, {
        //     timescale: 3,
        // }, 0)
        // tl.to( this.parameters, {
        //     timescale: 1,
        //     duration: 1,
        //     ease: 'power1.in',
        // }, 0.8)
    }
}

			