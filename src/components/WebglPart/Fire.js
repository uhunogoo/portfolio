import gsap from 'gsap'
import React from 'react'
import { AdditiveBlending, Color, PlaneGeometry, DoubleSide, Vector3 } from 'three'
import { PreloadedContext } from '../Providers/PreloadedContentProvider'

import FireMaterial from './FireMaterial'

const colors = [
    new Color('#ff0000'),
    new Color('#fff700'),
    new Color('#111111')
]

const emptyObject = new PlaneGeometry(0.15, 0.15, 1, 1)

function Fire({ count = 50, radius = 1 }) {
  const { preloadedContent } = React.useContext(PreloadedContext);
  const fireTexture = React.useMemo(() => {
    const fireTexture = preloadedContent?.find(
      (el) => el.name === 'fireTexture'
    ).item;
    return fireTexture;
  }, [preloadedContent]);

    // Inastance buffer
    const instancedBuffer = React.useRef(null)

    // Attributes and textures
    const sparks = React.useMemo(() => {
        const color = []
        const opacity = []
        const position = []
        const scale = []
        const speed = []
        const rotation = []
        
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2
            const random = radius * Math.random()
            
            const scaleFactor = 1 - Math.pow(Math.cos( Math.PI * random /2 ), 3.5)
            position.push({
                position: new Vector3().fromArray([
                    Math.cos( angle ) * random,
                    Math.min(Math.random(), (1 - scaleFactor)) * 0.6,
                    Math.sin( angle ) * random
                ])
            })

            color.push( ...colors[gsap.utils.random(0, colors.length - 1, 1)].toArray() )
            scale.push( gsap.utils.random(1, 2.5) )
            speed.push( gsap.utils.random(0.5, 1) )
            rotation.push( gsap.utils.random(0, 1) * Math.PI )
            opacity.push( gsap.utils.random(0.3, 0.4) )
        }
        
        const sortedOffset = sortPositions( new Vector3(0, 0, 20), position )
        return {
            color: new Float32Array( color ), 
            offset: new Float32Array( sortedOffset ), 
            rotation: new Float32Array( rotation ),
            opacity: new Float32Array( opacity ),
            sizes: new Float32Array( scale ),
            speed: new Float32Array( speed )
        }
    }, [count, colors, radius])
    // Hooks
    React.useEffect(() => {
        if (!instancedBuffer.current) return 
        
        // Apply attributes
        const bufferGeometry = instancedBuffer.current
        bufferGeometry.setAttribute('position', emptyObject.attributes.position )
        bufferGeometry.setAttribute('uv', emptyObject.attributes.uv )
        bufferGeometry.setIndex( emptyObject.index )

        bufferGeometry.attributes.position.needsUpdate = true
        bufferGeometry.attributes.offset.needsUpdate = true 
    }, [])

    return <>
    <group position={[ 1.7, 0.4, 3.65 ]} scale={ 0.34}>
      <mesh>
        <instancedBufferGeometry instanceCount={ count } ref={ instancedBuffer } >
          <instancedBufferAttribute attach={"attributes-color"} args={[ sparks.color, 3]} />
          <instancedBufferAttribute attach={"attributes-offset"} args={[ sparks.offset, 3]} />
          <instancedBufferAttribute attach={"attributes-scale"} args={[ sparks.sizes, 1]} />
          <instancedBufferAttribute attach={"attributes-speed"} args={[ sparks.speed, 1]} />
          <instancedBufferAttribute attach={"attributes-rotation"} args={[ sparks.rotation, 1]} />
          <instancedBufferAttribute attach={"attributes-opacity"} args={[ sparks.opacity, 1]} />
        </instancedBufferGeometry>
        <FireMaterial
          uTexture={ fireTexture }
          blending={ AdditiveBlending }
          depthWrite={false}
          side={ DoubleSide }
          depthTest
          transparent
        />
      </mesh>
    </group>
    </>
}

// Sort grass layer
function sortPositions ( camera, positions ) {
    positions.sort( (a, b) => {
        const d1 = camera.distanceToSquared( a.position )
        const d2 = camera.distanceToSquared( b.position )
        if (d1 > d2) {
            return -1
        } 
        if( d1 < d2 ) {
            return 1
        }
        return 0
    })

    const sortedPositions = [] 
    positions.forEach( el => 
        sortedPositions.push(
            el.position.x, 
            el.position.y,
            el.position.z 
        )
    )
    
    return sortedPositions
}

export default React.memo( Fire );