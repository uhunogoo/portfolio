uniform float uTime;

// varying
varying vec2 vUv;

attribute vec3 offset;
attribute vec2 rotation;
attribute float scale;

varying vec3 vPosition;
varying float vNoise;

mat2 get2dRotateMatrix(float _angle) {
    return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
}

// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main(){
	float noise = ( snoise( offset.xz / vec2(2.0, 4.0) + vec2(0.0, uTime * 0.5) ) );
	float staticNoise = 1.0 - abs( snoise( offset.xz / vec2(5.0, 10.0) ) );

	vec3 st = position * scale;
	st *= 1.0 + staticNoise;
	st.y -= 0.2;
	st.xz *= get2dRotateMatrix( rotation.y );
	st += offset;
	vec4 modelPosition = modelMatrix * vec4(st, 1.0);

	


	modelPosition.xz *= get2dRotateMatrix( noise * uv.y * 0.01 );
	// modelPosition.xz *= noise ;
	modelPosition.xz -= noise * step(0.6, uv.y) * 0.04;


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;


    gl_Position = projectionPosition;
	
	vUv = uv;
	vNoise = noise;
}