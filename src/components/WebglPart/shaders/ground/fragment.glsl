uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uTexture_2;
uniform sampler2D uShadow;
uniform vec3 uColorMask;
uniform vec3 uColorMaskSecond;

// Varying
varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// http://iquilezles.org/www/articles/voronoise/voronoise.htm
vec3 hash3( vec2 p ) {
    vec3 q = vec3( dot(p,vec2(127.1,311.7)),
                   dot(p,vec2(269.5,183.3)),
                   dot(p,vec2(419.2,371.9)) );
    return fract(sin(q)*43758.5453);
}

float iqnoise( in vec2 x, float u, float v ) {
    vec2 p = floor(x);
    vec2 f = fract(x);

    float k = 1.0+63.0*pow(1.0-v,4.0);

    float va = 0.0;
    float wt = 0.0;
    for (int j=-2; j<=2; j++) {
        for (int i=-2; i<=2; i++) {
            vec2 g = vec2(float(i),float(j));
            vec3 o = hash3(p + g)*vec3(u,u,1.0);
            vec2 r = g - f + o.xy;
            float d = dot(r,r);
            float ww = pow( 1.0-smoothstep(0.0,1.414,sqrt(d)), k );
            va += o.z*ww;
            wt += ww;
        }
    }

    return va/wt;
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

float rand(vec2 co, float seed) {
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt= dot(co.xy ,vec2(a,b));
    float sn= mod(dt, 3.14);
    return fract(sin(sn + seed) * c);
}

vec3 rgbToVec( float r, float g, float b ) {
    vec3 color = vec3(r / 255.0, g / 255.0, b / 255.0);

    return color;
}

void main() {
    vec2 st = vUv;
    float scale = 20.0;
	
    vec2 newST = fract(st * scale);
	vec2 i_st = floor( st * scale ) / scale;

    float strength = rand(i_st, scale);
	vec3 color = vec3( newST, 1.0 );
    float square = 1.0 - step(0.5, max(abs(newST.x - 0.5), abs(newST.y - 0.5)));
	float noise = iqnoise((st - 0.5) * scale * 2.0 + 0.5, 0.5 , .8);

    float size = mix(0.5, 0.8, strength);
    vec2 rotateST = rotate( (newST - 0.5) * size + 0.5, PI * 2.0 * strength, vec2(0.5) );
    rotateST = (rotateST - 0.5) * 0.7 + 0.5;

    vec4 grass = texture2D(uTexture_2, rotateST);
	vec4 ground = texture2D(uTexture, rotateST);
	vec4 ground2 = texture2D(uTexture, st);
	vec4 shadow = texture2D(uShadow, (st - 0.5) * 0.99 + 0.5);
	
    vec3 finalGrassTexture = mix(
        ground.rgb,
        grass.rgb * uColorMask,
        smoothstep(-0.7, 0.4, dot(grass.r - noise, ground.r + noise))
    );
    finalGrassTexture = clamp( finalGrassTexture, 0.0, 1.0 );

	vec3 finalTexture = mix(
		finalGrassTexture * 0.4,
		finalGrassTexture,
		shadow.r
	);

    finalTexture = mix(ground2.rgb, finalTexture, square);
    finalTexture = clamp( finalTexture, 0.0, 1.0 );
    // finalTexture *= uColorMask;

    float grayscale = 0.21 * finalTexture.r + 0.72 * finalTexture.g + 0.07 * finalTexture.b;

    gl_FragColor = vec4(vec3( finalTexture ), 1.0);
    // gl_FragColor = vec4(vec3( smoothstep(-0.7, 0.9, dot(grass.r - noise * 1.5, ground.r + noise * 1.5)) ), 1.0);

	
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}