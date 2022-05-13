import * as THREE from 'three'
export default class Points {
    constructor() {
        // Setup
        this.list = [
            {
                element: document.querySelector('.point-0'),
                position: new THREE.Vector3( 0, 1, 0 ),
                animationParameters: {
                    step: 2,
                    radius: 2
                }
            },
            {
                element: document.querySelector('.point-1'),
                position: new THREE.Vector3( 0, 3.2, 0 ),
                animationParameters: {
                    step: 0.4,
                    radius: 2
                }
            },
            {
                element: document.querySelector('.point-2'),
                position: new THREE.Vector3( 3, 0.3, -2 ),
                animationParameters: {
                    step: 1.82,
                    radius: 5
                }
            }
        ]
    }
}