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
        this.targetBlockSizes = this.targteBlock.getBoundingClientRect()

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
        gsap.set( '.following', {autoAlpha: 1})

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
    mouseMove( intersect ) {
        let isFocused = false
        
        if (this.mouse.moveTarget['localName']) {
            const targetRole = () => {
                // Get target role
                let role = null
                if ( this.mouse.moveTarget.attributes.role ) {
                    role = this.mouse.moveTarget.attributes.role.value
                    // console.dir( this.mouse.moveTarget.attributes.role )
                } else if (this.mouse.moveTarget.parentElement.attributes.role) {
                    // Get parent element role if tagret isn't button
                    role = this.mouse.moveTarget.parentElement.attributes.role.value
                }
                return role
            }            
            
            isFocused = targetRole() === 'button'
                       
        }
        
        if ( isFocused || intersect ) {
            this.followButtonIn.play().timeScale(2)
        } else {
            this.followButtonIn.reverse()
        }


        if ( this.body.clientWidth < 767.5 ) return 
        const { x, y } = this.mouse
        
        gsap.to('.following', {
            x: ( (x + 1) / 2 ) * this.size.width - this.targetBlockSizes.width * 0.5,
            y: ( (- y + 1) / 2 ) * this.size.height - this.targetBlockSizes.height * 0.5,
            duration: 0.3,
            ease: 'power1'
        })
        
    }

}