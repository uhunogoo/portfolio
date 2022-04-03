varying vec2 vUv;
varying float vNoise;
varying float vStaticNoise;

void main() {
    vec2 st = vUv;

    vec3 color = vec3(0.0, 1.0, 0.0);
    float noise = clamp(vNoise, 0.8, 1.0);
    
    vec3 baseColor = vec3( 0.41, 1.0, 0.5 );
    float clarity = ( vUv.y * 0.8 ) + 0.2;

    float mask = smoothstep( 1., 1.0, pow( abs( (1.0 - st.x) + (1.0 - st.y) / 2.0) + .5, 1.0));
    mask *= smoothstep(1., 1., pow( abs( (st.x) + (1.0-st.y) / 2.0) + .5, 1.0));

    float grassGradient = abs( st.x - 0.5 ) * 2.0 + .5;
	grassGradient = 1.0 - clamp( grassGradient, 0.0, 1.0 );

    // gl_FragColor = vec4( baseColor * clarity * noise, 1.0 );
    gl_FragColor = vec4( (baseColor * clarity * noise - (grassGradient * 0.3)) - vStaticNoise * 0.2, 1.0);
}