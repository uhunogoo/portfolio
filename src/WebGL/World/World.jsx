import { Sparkles, Center, Float } from '@react-three/drei'

import Tower from '../Tower/Tower.jsx'
import Camera from '../Camera/Camera.jsx'
import CustomSky from '../Sky/CustomSky.jsx'
import Fire from '../Fire/Fire.jsx'

const floatingParams = {
    speed:  1.4,
    floatIntensity: 1.2,
    rotationIntensity:  0.3,
    floatingRange: [-0.2, 0.2],
}

export default function World({ mouse }) {

    return <>
        <Camera mouse={ mouse }/>
        <CustomSky />
        
        <Center disableX disableZ>
            <Float {...floatingParams} >
                <Tower />
                <Fire count={260} radius={0.5} />
            </Float>
            <Sparkles 
                size={ 6 }
                scale={[ 26, 0.1, 26 ]}
                position-y={ 0.3 }
                count={ 50 }
            />
        </Center>

    </>
}