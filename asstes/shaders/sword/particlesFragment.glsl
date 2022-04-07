varying vec2 vUv;

void main() {
    vec2 st = vUv;

    vec3 color = vec3(1.0, 1.0, 1.0);

    float area = distance( gl_PointCoord, vec2(0.5) );
    float strength = 0.04 / area - 0.1;

    gl_FragColor = vec4( color, strength);
}