varying vec2 vUv;
varying float vNoise;
varying float vStaticNoise;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uColor1;
uniform vec3 uColor2;

void main() {
    vec2 st = vUv;

    vec3 color = vec3(0.0, 1.0, 0.0);
    float noise = clamp(vNoise, 0.8, 1.0);
    
    vec3 baseColor = uColor1;
    vec3 secondColor = uColor2;
    vec3 light = vec3(1.0, 0.8667, 0.0078);
    float clarity = ( vUv.y * 0.8 ) + 0.2;

    float grassGradient = abs( st.x - 0.5 ) * 2.0 + 0.5;
	grassGradient = 1.0 - clamp( grassGradient, 0.01, 1.0 );

    float shadow = dot(vec3(st, 1.0), vec3(0.0, 1.0, 0.0) );
    shadow = clamp(shadow, 0.0, 1.0);
    float sun = dot(vec3(vec2(1.0) - st, -1.0), vec3(0.0, 7.0, 0.0) );
    sun = clamp(sun, 0.0, 1.0);

    // baseColor
    baseColor *= mix(0.6, 1.1, vPosition.y);
    vec3 finalColor = mix( vec3(0.23, 0.23, 0.23), baseColor, shadow );
    finalColor = mix( finalColor, uColor2, (1.0 - sun) * 0.2 + vStaticNoise );
    
    
    gl_FragColor = vec4( finalColor + abs(cos(vNoise * 50.0) * vNoise * 6.0), 1.0); 
}