uniform float uTime;

// varying
varying vec2 vUv;

attribute vec3 offset;

varying vec3 vPosition;
varying vec4 vColor;

void main(){
	vPosition = offset * 10.0 + position;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );

}