import * as THREE from 'three'
export default class Points {
    constructor() {
        // Setup
        this.list = [
            {
                name: 'point-2',
                id: 0,
                element: document.getElementById('point-1'),
                position: new THREE.Vector3( -0.2, 1, 0 ),
                animationParameters: {
                    angle: 0,
                    radius: 1
                }
            },
            {
                name: 'point-1',
                id: 1,
                element: document.getElementById('point-0'),
                position: new THREE.Vector3( 3.85, 0.3, 1.2 ),
                animationParameters: {
                    angle: 0,
                    radius: 2.5
                }
            },
        ]
    }
}