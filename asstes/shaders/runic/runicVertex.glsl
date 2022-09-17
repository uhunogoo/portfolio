// varying
varying vec2 vUv;

void main() {

  vec4 st = vec4( position, 1.0 );
  vec4 modelViewPosition = modelViewMatrix * st;


  // Points

  gl_Position = projectionMatrix * modelViewPosition;

  // varying
  vUv = uv;
}
