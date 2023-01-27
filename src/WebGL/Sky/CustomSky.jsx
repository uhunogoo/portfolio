import { BackSide } from 'three'

import { useControls } from 'leva'
import { GradientTexture } from '@react-three/drei'

// Component Parts
import Clouds from './Clouds.jsx'


const GenerateSky = () => {
    const skyParameters = useControls('Sky settings',{
        top: '#0053ff',
        // middleTopColor: '#ffe4cb',
        middleTopColor: '#e7d7c7',
        middleColor: '#e4e4e4',
        middleBottomColor: '#ff9900',
        bottom: '#f5ca7f',
        middleTop: {value: 0.57, min: 0, max: 1, step: 0.001 },
        middle: {value: 0.69, min: 0, max: 1, step: 0.001 },
        middleBottom: {value: 0.769, min: 0, max: 1, step: 0.001 },
    })

    return (
        <mesh position-y={1}>
            <icosahedronGeometry args={[ 12.5, 3 ]} />
            <meshBasicMaterial side={ BackSide } toneMapped={false} depthTest={false}>
                <GradientTexture
                    stops={[0, skyParameters.middleTop, skyParameters.middle, skyParameters.middleBottom, 1]}
                    colors={[
                        skyParameters.top, 
                        skyParameters.middleTopColor,
                        skyParameters.middleColor,
                        skyParameters.middleBottomColor,
                        skyParameters.bottom
                    ]}
                    size={1024}
                />
            </meshBasicMaterial>
        </mesh>
    )
}

export default function CustomSky() {
    return <>
        <GenerateSky />
        <Clouds count={ 20 } size={ 50 } />
    </> 
}