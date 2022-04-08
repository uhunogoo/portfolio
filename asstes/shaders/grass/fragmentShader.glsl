varying vec2 vUv;
varying float vNoise;
varying float vStaticNoise;
varying vec3 vNormal;

uniform vec3 uColor1;
uniform vec3 uColor2;

void main() {
    vec2 st = vUv;

    vec3 color = vec3(0.0, 1.0, 0.0);
    float noise = clamp(vNoise, 0.8, 1.0);
    
    vec3 baseColor = uColor1;
    vec3 secondColor = uColor2;
    float clarity = ( vUv.y * 0.8 ) + 0.2;

    float mask = smoothstep( 1., 1.0, pow( abs( (1.0 - st.x) + (1.0 - st.y) / 2.0) + .5, 1.0));
    mask *= smoothstep(1., 1., pow( abs( (st.x) + (1.0-st.y) / 2.0) + .5, 1.0));

    float grassGradient = abs( st.x - 0.5 ) * 2.0 + 0.5;
	grassGradient = 1.0 - clamp( grassGradient, 0.01, 1.0 );


    vec3 darkGreen = mix(  vec3(0.35), vec3(clamp(0.5 * vStaticNoise / st.y + vStaticNoise, 0.0, 1.0)), vStaticNoise ); 
    vec3 mixColor = mix( secondColor * darkGreen, baseColor - noise * 0.1, clarity );

    gl_FragColor = vec4( (mixColor - (grassGradient * 0.08)) - (1.0 - vStaticNoise) * 0.12, 1.0);
    
    
    
    gl_FragColor = vec4( vec3(dot(vec3(st, 1.0), vec3(0.0, 2.0, 0.0) )), 1.0);
}