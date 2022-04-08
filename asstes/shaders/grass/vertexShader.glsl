uniform float uTime;

// varying
varying vec2 vUv;
varying float vNoise;
varying float vStaticNoise;
varying vec3 vNormal;

//	Classic Perlin 3D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
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

// rotation
mat2 get2dRotateMatrix(float _angle)
{
    return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
}


void main() {

    vUv = uv;
    float t = uTime;
    
    // VERTEX POSITION
    
    vec4 mvPosition = vec4( position, 1.0 );
    mvPosition = instanceMatrix * mvPosition;
    
    // DISPLACEMENT
    
    mvPosition.y += (1.0 - smoothstep( 0.0, 2.5, length( mvPosition.xz * 0.5) )) * 1.25;
    float noise = cnoise( (mvPosition.xz * vec2(1.0, 0.5) + vec2(0.0, t ) ) + cnoise( (mvPosition.xz / vec2(4.0) + vec2(0.0, t * 0.3 ) )));
    noise = pow(noise * 0.5 + 0.5, 2.) * 2.;
    float staticNoise = cnoise( (mvPosition.xz * vec2(1.0, 0.5) ) + cnoise( (mvPosition.xz * vec2(1.0, 0.5) )));
    
    // here the displacement is made stronger on the blades tips.
    float dispPower = 0.3 / length(uv.y * 2.0) - 0.6;
    
    float displacement = noise * ( 0.3 * dispPower );
	// mvPosition.xz *= (1.0 + (1.0 + sin(uTime)) / 2.0);
    // mvPosition.z -= uv.y * 0.15 * noise;
    // mvPosition.x -= uv.y * 0.05 * sin(noise * 3.0);




    
    vec4 modelViewPosition = modelViewMatrix * mvPosition;
    gl_Position = projectionMatrix * modelViewPosition;

    vNoise = noise;
    vStaticNoise = staticNoise;
    vNormal = normal;
}