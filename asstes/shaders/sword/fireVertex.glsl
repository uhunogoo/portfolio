uniform float uTime;

// varying
varying vec2 vUv;
varying vec3 vPosition;

// Functions
mat2 get2dRotateMatrix(float _angle)
{
    return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
}

void main() {
  float t = uTime;
  vec4 st = vec4( position, 1.0 );


  vec4 modelViewPosition = modelViewMatrix * st;
  vec4 projectionPosition = projectionMatrix * modelViewPosition;


  // Final
  gl_Position = projectionPosition;


  // varying
  vUv = uv;
  vPosition = st.xyz;
}