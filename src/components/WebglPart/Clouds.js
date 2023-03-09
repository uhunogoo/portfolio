import gsap from 'gsap'
import { PlaneGeometry } from 'three'

import React, { useMemo, useRef } from 'react'
import { Instance, Instances } from '@react-three/drei'


const Cloud = ({ position, scale , size, speed}) => {
  const el = useRef( null )
  
  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const positionZ = gsap.quickTo(el.current.position, 'z', { ease: 'sine1.inOut'});
      const positionY = gsap.quickTo(el.current.position, 'y', { ease: 'sine4.inOut'});
      
      gsap.to(el.current.position, {
        repeat: -1,
        duration: speed, 
        ease: "none",
        x: "+=" + size * 2,
        immediateRender: true,
        onUpdate: () => {
          const strength = el.current.position.x / size;
          el.current.rotation.y = - strength * Math.PI * 0.3;
          el.current.rotation.x = Math.PI * 0.1 + Math.abs(strength) * Math.PI * 0.2;
          positionZ( position[2] + Math.abs( strength ) * 10 );
          positionY( position[1] - Math.abs( strength * 5 ) );
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


const cloudGeometry = new PlaneGeometry(1, 1, 1, 1);

function Clouds({ count = 30, size = 50, texture }) {
  const clouds = useMemo(() => {
    const result = []
    
    for (let i = 0; i < count; i++) {
        const position = [
          (Math.random() - 0.5) * size * 2,
          4 + Math.random() * size * 0.2,
          - Math.random() * 20
        ]

        const scaleX = gsap.utils.random(8, 12) * 1.4
        const scaleY = gsap.utils.random(4, 8)
        
        const scale = [
          scaleX * 1.5, 
          scaleY * 1.5, 
          1
        ]
        
        // Push line parameters
        result.push({
          position: position,
          scale: scale,
          speed: gsap.utils.random(20, 40)
        })
      }
      return result
  }, [count, size])

  return <>
    <Instances 
      range={count}
      geometry={ cloudGeometry }
    >
      <meshBasicMaterial 
        toneMapped={false} 
        transparent={ true } 
        depthWrite={ false }
        map={ texture } 
      />
      
      <group position={[0, 2, -6 ]} dispose={null} >
        {clouds.map( (props, i) => (
          <Cloud key={ Date.now() + i } {...props} size={ size } />
        ))}
      </group>
    </Instances>
  </>
}

export default React.memo( Clouds );