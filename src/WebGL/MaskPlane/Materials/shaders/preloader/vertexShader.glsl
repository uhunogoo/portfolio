uniform float uProgress;
uniform vec2 uAspect;

// varying
varying vec2 vUv;
varying float vSmog;


//	Classic Perlin 3D Noise
//	by Stefan Gustavson
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
const mat2 m=mat2(1.6,1.2,-1.2,1.6);
float fbm(vec2 n){
	float total=0.,amplitude=.1;
	for(int i=0;i<7;i++){
		total+=cnoise(n)*amplitude;
		n=m*n;
		amplitude*=.4;
	}
	return total;
}

void main() {
  float progress = uProgress;
  vec2 smogUV = vec2(uv - 0.5) * uAspect + 0.5;
  
  vec4 st = vec4( position, 1.0 );
  vec4 modelViewPosition = modelViewMatrix * st;

  // gl_Position = projectionMatrix * modelViewPosition;
  gl_Position = vec4(position, 1.0);
  // varying
  vUv = uv;
  vSmog = fbm( smogUV * 1.4 + progress * 0.7 + fbm(smogUV + progress * 1.1 ) + fbm(smogUV * 8.0) ) * 8.0;
}