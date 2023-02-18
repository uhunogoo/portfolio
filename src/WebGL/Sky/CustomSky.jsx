import { BackSide } from 'three'

import { GradientTexture } from '@react-three/drei'

// Component Parts
import Clouds from './Clouds.jsx'


const GenerateSky = () => {
    const skyParameters = {
        top: '#0053ff',
        middleTopColor: '#e7d7c7',
        middleColor: '#e4e4e4',
        middleBottomColor: '#ff9900',
        bottom: '#f5ca7f',
        middleTop: 0.57,
        middle: 0.69,
        middleBottom: 0.769,
    }

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