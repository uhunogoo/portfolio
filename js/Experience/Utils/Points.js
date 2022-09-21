import { Vector3 } from 'three'
export default class Points {
    constructor() {
        // Setup
        this.list = [
            {
                name: 'point-2',
                id: 0,
                element: document.getElementById('point-1'),
                position: new Vector3( 0, 1, 0.2 ),
                animationParameters: {
                    angle: { x: - Math.PI * 0.3, y: 0 },
                    radius: 1
                }
            },
            {
                name: 'point-1',
                id: 1,
                element: document.getElementById('point-0'),
                position: new Vector3( -1.2, 0.65, 3.9 ),
                animationParameters: {
                    angle: { x: 0, y: Math.PI * 0.5 },
                    radius: 2.5
                }
            },
        ]
    }
}
