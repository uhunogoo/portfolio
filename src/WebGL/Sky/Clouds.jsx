import gsap from 'gsap'
import { PlaneGeometry } from 'three'

import { useContext, useLayoutEffect, useMemo, useRef } from 'react'
import { Instance, Instances } from '@react-three/drei'
import { SceneContext } from '../Experience.jsx'


const Cloud = ({ position, scale , size, speed}) => {
    const el = useRef( null )
    
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const positionZ = gsap.quickTo(el.current.position, 'z', { ease: 'none'})
            const positionY = gsap.quickTo(el.current.position, 'y', { ease: 'sine4.inOut'})
            
            gsap.to(el.current.position, {
                repeat: -1,
                duration: speed, 
                ease: "none",
                x: "+=" + size * 2,
                immediateRender: true,
                onUpdate: () => {
                    const strength = el.current.position.x / size
                    el.current.rotation.y = - strength * Math.PI * 0.3
                    el.current.rotation.x = Math.PI * 0.1 + Math.abs(strength) * Math.PI * 0.2
                    positionZ( position[2] + Math.abs( strength ) * 20 )
                    positionY( position[1] - Math.abs( strength * 5 ) )
                },
                modifiers: {
                    x: gsap.utils.wrap(-size, size)
                }
            })
        })

        return () => ctx.revert()
    }, [])
    return (
        <group ref={ el } position={ position } scale={ scale }>
            <Instance />
        </group>
    )
} 

const cloudGeometry = new PlaneGeometry(1, 1, 1, 1)
const CloudMaterial = () => {
    const data = useContext( SceneContext )
    const cloudTexture = useMemo( () => data.cloud.clone(), [])
    return (
        <meshBasicMaterial 
            toneMapped={false} 
            transparent={ true } 
            depthWrite={ false }
            map={ cloudTexture } 
        />
    )
}

export default function Clouds({ count = 30, size = 50 }) {
    const clouds = useMemo(() => {
        const result = []
        
        for (let i = 0; i < count; i++) {
            const position = [
                (Math.random() - 0.5) * size * 2,
                1.5 + Math.random() * size * 0.2,
                - Math.random() * 20
            ]

            const scaleX = gsap.utils.random(6, 12)
            const cloudScale = (position[1] + scaleX) * 0.1
            
            const scale = [
                (scaleX + cloudScale * 1.5) * 1.5, 
                (scaleX * 0.3 + cloudScale) * 1.5, 
                1
            ]
            
            // Push line parameters
            result.push({
                position: position,
                scale: scale,
                speed: gsap.utils.random(15, 25)
            })
        }
        return result
    }, [count, size])

    return <>
        <Instances 
            range={count}
            geometry={ cloudGeometry }
        >
            <CloudMaterial />
            
            <group position={[0, 2, -6 ]} dispose={null} >
                {clouds.map( (props, i) => (
                    <Cloud key={ Date.now() + i } {...props} size={ size } />
                ))}
            </group>
        </Instances>
    </>
}