varying vec2 vUv;
varying float vNoise;
varying vec2 vPosition;
varying float vScale;
varying float vMultiply;
varying float vWind;
varying float vTextureType;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec2 uShadowVec;
uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uTexture1;
uniform sampler2D uShadows;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

mat2 get2dRotateMatrix(float _angle){
	return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));
}

void main(){
	vec2 st=vUv;
	
	vec3 color1=uColor1;
	vec3 color2=uColor2;

	float wavyMotion = sin(vWind  + st.x * 2.0);
	float grassStrength = smoothstep(0.0, 1.0, st.y );
	vec4 grassTexture = mix(
		texture2D( 
		uTexture, 
		vec2( 1.0 - st.x, st.y) + wavyMotion * vec2( grassStrength * 0.06, wavyMotion * grassStrength * 0.03  ) 
		),
		texture2D( 
		uTexture1, 
		st + wavyMotion * vec2( grassStrength * 0.06, wavyMotion * grassStrength * 0.03  ) 
		),
		1.0 - vTextureType
	);
	
	if(grassTexture.a<.65)discard;
	
	float sunnyPlace=smoothstep(.6,.85,1.-(vMultiply-.5));
	sunnyPlace=clamp(sunnyPlace,0.,1.);
	
	float grey=(grassTexture.r+grassTexture.g+grassTexture.b)/3.;
	float pos=length(vPosition);
	
	vec3 customColors=mix(uColor1,uColor2-(1.-vScale)*.4,grey*1.2*vMultiply);
	
	vec3 finalColor=mix(
		customColors.rgb,
		customColors.rgb*.75,
		(abs(1.-length(st.x-.5))*(1.-st.y*2.))*2.5+vNoise-1.
	);
	
	float noise=clamp(vNoise,0.,1.);
	
	// Shadows
	vec2 shadowNewUV=(vPosition-.5)/2.+.5;
	shadowNewUV+=uShadowVec;
	shadowNewUV=(shadowNewUV-.5)*get2dRotateMatrix(PI*.5)+.5;
	vec4 shadowTexture=texture2D(uShadows,shadowNewUV);
	float shadow=clamp(shadowTexture.r,.7,1.);
	
	//  Final color calcullation
	vec3 color=finalColor*shadow;
	finalColor=mix(color,color-noise*.13*st.y,noise);
	finalColor=vec3(mix(finalColor*1.1,finalColor*2.,sunnyPlace));
	finalColor=clamp(finalColor,0.,1.);
	
	gl_FragColor=vec4(finalColor,grassTexture.a);
	#if defined(TONE_MAPPING)
	gl_FragColor.rgb=toneMapping(gl_FragColor.rgb);
	#endif
}
