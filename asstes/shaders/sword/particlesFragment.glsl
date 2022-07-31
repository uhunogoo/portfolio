uniform float uTime;

varying vec2 vUv;
varying float vInterval;

void main() {
    vec2 st = vUv;
    vec3 color1 = vec3(0.9882, 0.5686, 0.0196);


    float area = distance( gl_PointCoord, vec2(0.5) );
    float strength = 0.08 / area - 0.16;
    strength *= sin( uTime / vInterval) / 2.0;
    strength = clamp(strength, 0.0, 1.0);

    gl_FragColor = vec4( vec3( 1.0 ), strength);
}