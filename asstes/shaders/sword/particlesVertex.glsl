uniform float uTime;
uniform float uPixelRatio;

attribute float vSpeed;

// varying
varying vec2 vUv;
varying float vInterval;

mat2 get2dRotateMatrix(float _angle) {
		return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
}
void main(){
  // Scaling
	vec3 st = position;
  float speed = vSpeed * 0.6;
  st.xz *= get2dRotateMatrix(-uTime * speed + (sin(position.z) + cos(position.x)) * 20.0);
  st.y += (sin(st.z) + cos(st.x) + speed) * 0.2;
  st.z += sin(uTime + st.x * 2.0) * speed;

	vec4 modelPosition = modelMatrix * vec4(st, 1.0);
	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 projectionPosition = projectionMatrix * viewPosition;

  // Points 
  gl_PointSize = 50.0 * uPixelRatio;
  gl_PointSize *= ( 1.0 / - viewPosition.z);
	gl_Position = projectionPosition;
  
  // Varuing
	vUv = uv;
  vInterval = vSpeed;
}