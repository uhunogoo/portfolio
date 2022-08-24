import gsap from 'gsap'
import Experience from '../Experience'

export default class followingCursor {
    constructor () {
        // Setup
        this.experience = new Experience()
        this.mouse = this.experience.mouse
        this.size = this.experience.sizes
        
        // Defaults
        this.body = document.body
        this.targteBlock = document.querySelector('.following')
        
        this.svgParameters = {
            count: 2,
            target: this.targteBlock.querySelector('.following__look'),
            element: () => {
                // Generate SVG circle
                const circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
                gsap.set( circle, {
                    attr: {
                        r: 180,
                        cx: 250,
                        cy: 250,
                    },
                })

                return circle
            }
        }
        this.followButtonIn = gsap.timeline({ 
            paused: true, 
        })
        
        this.createSvg( this.svgParameters )
    }
    createSvg( parameters ) {        
        // Append circle to main SVG
        const circle = parameters.element()
        circle.classList.add( 'circle' )    
        parameters.target.appendChild( circle )

        gsap.set( 'svg .ring', {
            attr: { 
                fill: 'none', 
                stroke: '#ffffff',
            },
            strokeWidth: 8
        })
        gsap.set( 'svg .circle', {
            attr: { 
                fill: '#ffffff',
            },
        })

        // Animation
        this.followButtonIn.fromTo('.following__look .ring', {scale: 1}, {
            scale: .3,
            duration: 0.3,
            ease: 'power1',
            transformOrigin: '50% 50%'
        }, 0)
        this.followButtonIn.fromTo('.following__look .circle', {scale: 0, transformOrigin: '50% 50%'}, {
            scale: 0.3,
            duration: 0.6,
            ease: 'power1.out',
            transformOrigin: '50% 50%'
        }, 0)

    }
    mouseMove() {
        if ( this.body.clientWidth < 767.5 ) return 
        
        const { x, y } = this.mouse
        const targetBlockSizes = this.targteBlock.getBoundingClientRect()
        

        gsap.to('.following', {
            x: ( (x + 1) / 2 ) * this.size.width - targetBlockSizes.width * 0.5,
            y: ( (- y + 1.0) / 2 ) * this.size.height - targetBlockSizes.height * 0.5,
            ease: 'power4'
        })
        
    }

}