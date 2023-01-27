uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec2 uShadowVec;
uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uTexture1;
uniform sampler2D uShadowMap;

varying vec2 vUv;
varying float vNoise;
varying vec2 vPosition;
varying float vScale;
varying float vMultiply;
varying float vWind;
varying float vTextureType;
varying float vRotate;


#define PI 3.14159265359
#define TWO_PI 6.28318530718

mat2 get2dRotateMatrix(float _angle){
	return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));
}

void main(){
	vec2 st=vUv;
	vec2 rotateSt = (vPosition - vec2(0.4815, 0.4815)) * get2dRotateMatrix( PI ) + 0.5;
	rotateSt.x = 1.0 - rotateSt.x;
	
	vec3 color1=uColor1;
	vec3 color2=uColor2;

	float wavyMotion = sin(vWind  + st.x * 2.0);
	float grassStrength = smoothstep(0.0, 1.0, st.y );

	vec4 shadowTexture = texture2D( uShadowMap, rotateSt );
	float bakedShadow = 0.21 * shadowTexture.r + 0.72 * shadowTexture.g + 0.07 * shadowTexture.b;
	vec2 textureST = mix( vec2(1.0 - st.x, st.y), st, vRotate );
	vec4 grassTexture = mix(
		texture2D( 
			uTexture, 
			textureST
		),
		texture2D( 
			uTexture1, 
			textureST
		),
		1.0 - vTextureType
	);

	float grey = 0.21 * grassTexture.r + 0.72 * grassTexture.g + 0.07 * grassTexture.b;
	grey = clamp( grey, 0.0, 1.0 );

	float sunny = vMultiply;
	float scale = (0.5 + vScale) / 1.5;
	float grassScaleFactor = (1.0 - st.y * 2.0 * (1.5 - scale)) / 2.0;
	grassScaleFactor = clamp( grassScaleFactor, 0.0, 1.0 );
	vec3 finalColor = mix( 
		uColor2,
		uColor1,
		grey * (scale - sunny * vNoise * 0.35)
	);
	
	
	finalColor *=vScale * (1.0 - grassScaleFactor);
	// Color mask
	vec3 colorMask  = mix(
		vec3( floor(scale * 1.2), 0.0, 0.0 ),
		vec3( 0.0, floor(scale * 1.1), 0.0 ),
		scale
	);
	finalColor = mix(
		finalColor,
		finalColor + vec3(colorMask.r * 2.0, 0.0, 0.0),
		colorMask.r
	);
	// 103, 89, 94
	finalColor = mix(
		finalColor,
		finalColor * vec3( 103.0 / 255.0, 89.0 / 255.0, 94.0 / 255.0),
		colorMask.g
	);
	finalColor += vMultiply * 0.03 * vScale;
	finalColor += 0.025 * vec3((1.0 - grassScaleFactor), scale, 0.6 * (scale - vMultiply) );
	finalColor -= vWind * 0.02;

	finalColor = mix(
		finalColor * 0.4 - 0.2,
		finalColor * 2.4,
		bakedShadow
	);
	finalColor = mix( finalColor * 0.3, finalColor, st.y );

	finalColor = clamp( finalColor, vec3(0.0), vec3(1.0));
	
	gl_FragColor=vec4( finalColor, grassTexture.a);

	#include <tonemapping_fragment>
	#include <encodings_fragment>
	
	
}
