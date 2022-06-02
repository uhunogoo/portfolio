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
vec4 permute(vec4 x){return mod(((x*34.)+1.)*x,289.);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main(){
	float noise = ( cnoise( offset.xz / vec2(2.0, 4.0) + vec2(0.0, uTime * 0.5) ) );
	float staticNoise = 1.0 - abs( cnoise( offset.xz / vec2(5.0, 10.0) ) );
	float staticNoise2 = 1.0 - cnoise( offset.xz / vec2(0.5, 0.8) );

	vec3 st = position * scale;
	st *= 1.0 + staticNoise;
	st *= 0.5 + staticNoise2 * 0.2;
	st.xz *= get2dRotateMatrix( rotation.y );
	st.zy *= get2dRotateMatrix( sin(rotation.y * 2.0) * 0.2 );
	st += offset;
	vec4 modelPosition = modelMatrix * vec4(st, 1.0);


	modelPosition.xz *= get2dRotateMatrix( noise * uv.y * 0.01 );
	modelPosition.xz *= get2dRotateMatrix(noise * step(0.6, uv.y) * 0.01);


	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 projectionPosition = projectionMatrix * viewPosition;


	gl_Position = projectionPosition;
	
	vUv = uv;
	vNoise = staticNoise;
}