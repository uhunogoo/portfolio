varying vec2 vUv;
varying float vNoise;
varying vec2 vPosition;
varying float vScale;
varying float vMultiply;
varying float vWind;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec2 uShadowVec;
uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uShadows;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

mat2 get2dRotateMatrix(float _angle) {
		return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
}

void main() {
    vec2 st = vUv;
    
    vec3 color1 = uColor1;
    vec3 color2 = uColor2;

    float grassAngle = sin( st.y * PI );
    grassAngle = sin( st.y * PI + vNoise + uTime * 1.2 ) * 0.25;

    vec4 grassTexture = texture2D(
        uTexture, 
        st + vec2( grassAngle * vScale * 0.3 * st.y, 0.0 ) 
    );

    if(grassTexture.a < 0.65) discard;

    float sunnyPlace = smoothstep(0.6, 0.85, 1.0 - (vMultiply - 0.5));
    sunnyPlace = clamp(sunnyPlace, 0.0, 1.0);

    float grey = (grassTexture.r + grassTexture.g + grassTexture.b) / 3.0;
    float pos = length( vPosition );

    vec3 customColors = mix(uColor1, uColor2 - (1.0 - vScale) * 0.4, grey * 1.2 * vMultiply);

    vec3 finalColor = mix( 
        customColors.rgb, 
        customColors.rgb * 0.75, 
        (abs( 1.0 - length(st.x - 0.5) ) * (1.0 - st.y * 2.0)) * 2.5 + vNoise - 1.0 
    );

    float noise = clamp(vNoise, 0.0, 1.0);

    // Shadows 
    vec2 shadowNewUV = (vPosition - 0.5) / 2.0 + 0.5;
    shadowNewUV += uShadowVec;
    shadowNewUV = (shadowNewUV - 0.5) * get2dRotateMatrix(PI * 0.5) + 0.5;
    vec4 shadowTexture = texture2D( uShadows, shadowNewUV );
    
    //  Final color calcullation
    vec3 color = finalColor * shadowTexture.r;
    finalColor = mix( color, color - noise * 0.13 * st.y, noise );
    finalColor = vec3( mix( finalColor * 1.1, finalColor * 2.0, sunnyPlace ) );
    finalColor = clamp(finalColor, 0.0, 1.0);

    gl_FragColor = vec4( finalColor, grassTexture.a);
    #if defined( TONE_MAPPING )
        gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
    #endif
}