uniform float uTime;
uniform float uPixelRatio;

// varying
varying vec2 vUv;


mat2 get2dRotateMatrix(float _angle)
{
    return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
}

void main() {
  float t = uTime;

  vec4 st = vec4( position, 1.0 );

  float combine = (1.0 + sin( uTime + (st.x + st.z) * 4.0 )) * uv.y / 20.0;
  combine += (1.0 + cos( uTime + (st.x + st.z) * 4.0 )) * uv.y / 20.0;

  // st.y += (1.0 + sin(uTime + uv.y * 9.0)) / 40.0;
  // st.y = uv.y * (1.0 + sin(uTime)) * 0.5 - 0.5;
  st.xz *= 1.0 + (1.0 + sin(uTime * 6.0 + (combine * 2.0) * 8.0)) * uv.y * 0.2;
  st.xz *= get2dRotateMatrix( st.y * 8.0  - uTime * 4.0 );
  // st.y = uv.y * (1.0 + sin(uTime)) * 0.5 - 0.5;

  vec4 modelViewPosition = modelViewMatrix * st;

  // Points 
  gl_PointSize = 40.0 * uPixelRatio;
  gl_PointSize *= ( 1.0 / - modelViewPosition.z);

  gl_Position = projectionMatrix * modelViewPosition;

  // varying
  vUv = uv;
}