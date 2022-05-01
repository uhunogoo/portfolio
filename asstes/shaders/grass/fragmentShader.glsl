varying vec2 vUv;
varying float vBright;

uniform vec3 uColor1;
uniform vec3 uColor2;

void main() {
    vec2 st = vUv;
    
    vec3 color1 = uColor1;
    vec3 color2 = uColor2;

    vec3 finalColor = mix( color1, color2, abs( 1.0 - length(st.x - 0.5) ) * (1.0 - st.y * 2.0) );
    
    
    gl_FragColor = vec4( finalColor, 1.0); 
}