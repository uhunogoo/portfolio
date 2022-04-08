uniform float uTime;

// varying
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

// Functions
mat2 get2dRotateMatrix(float _angle)
{
    return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
}

void main() {
  float t = uTime;
  vec4 st = vec4( position, 1.0 );

  st.xz *= 1.0 + ((1.0 + sin(uTime * 10.0 + st.y * 60.0)) / 2.0) * 0.1;

  vec4 modelViewPosition = modelViewMatrix * st;
  vec4 projectionPosition = projectionMatrix * modelViewPosition;


  // Final
  gl_Position = projectionPosition;


  // varying
  vUv = uv;
  vPosition = st.xyz;
  vNormal = normal;
}