import * as THREE from 'three'
export default class Points {
    constructor() {
        // Setup
        this.list = [
            {
                name: 'point-1',
                element: document.getElementById('point-0'),
                position: new THREE.Vector3( 0, 1, 0 ),
                animationParameters: {
                    angle: 0,
                    radius: 1
                }
            },
            {
                name: 'point-2',
                element: document.getElementById('point-1'),
                position: new THREE.Vector3( 0, 3.2, 0 ),
                animationParameters: {
                    angle: Math.PI,
                    radius: 2
                }
            },
        ]
    }
}