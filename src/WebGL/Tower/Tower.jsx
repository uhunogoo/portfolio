import { useState, useMemo, useContext } from 'react'

// Imports
import GroundMaterial from './Materials/GroundMaterial.jsx'
import PortalMaterial from './Materials/PortalMaterial.jsx'
import Grass from '../Grass/Grass.jsx'
import { SceneContext } from '../Experience.jsx'


export default function Tower() {
    const data = useContext( SceneContext )
    return <>
        <group dispose={null} >
            <DecorParts model={ data.model } texture={ data.otherTexture } />
            <TowerParts model={ data.model } texture={ data.largeTexture } />
            
            
            <mesh
                geometry={ data.model.nodes.portal.geometry }
                position={ data.model.nodes.portal.position }
            >
                <PortalMaterial />
            </mesh>

            <mesh position-y={0.01} rotation-x={-Math.PI * 0.5} >
                <circleGeometry args={[12.6, 40]}/>
                <GroundMaterial />
            </mesh>
        </group>
        <Grass
            grassSampler={ data.model.nodes.ground }
            count={40000}
            radius={ 25 }
        />
    </>
}

function TowerParts({ model, texture }) {
    // Load textures
    const loadTexture = useMemo(() => texture.clone(), [])

    return <>
        <mesh
            geometry={ model.nodes.tower.geometry }
            position={ model.nodes.tower.position }
        >
            <meshBasicMaterial map={ loadTexture } />
        </mesh>
    </>
}
function DecorParts({ model, texture }) {
    // Load textures
    const loadTexture = useMemo(() => texture.clone(), [])
    const [decorMaterial, setDecorMaterial] = useState()

    return <>
        <meshBasicMaterial ref={ setDecorMaterial } map={loadTexture}/>

        <mesh
            material={ decorMaterial }
            geometry={ model.nodes.components.geometry }
            position={ model.nodes.components.position }
        />
        <mesh
            material={ decorMaterial }
            geometry={ model.nodes.runic.geometry }
            position={ model.nodes.runic.position }
        />
    </>
}