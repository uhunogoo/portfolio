import * as THREE from 'three'
export default class Points {
    constructor() {
        // Setup
        this.list = [
            {
                element: document.getElementById('point-0'),
                position: new THREE.Vector3( 0, 1, 0 ),
                animationParameters: {
                    angle: 1.75,
                    radius: 1
                }
            },
            {
                element: document.getElementById('point-1'),
                position: new THREE.Vector3( 0, 3.2, 0 ),
                animationParameters: {
                    angle: 0,
                    radius: 2
                }
            },
            {
                element: document.getElementById('point-2'),
                position: new THREE.Vector3( 3.8, 0.85, -1.8 ),
                animationParameters: {
                    angle: 1.56,
                    radius: 4
                }
            }
        ]
    }
}