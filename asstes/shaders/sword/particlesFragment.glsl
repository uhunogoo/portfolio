varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vec2 st = vUv;

    vec3 color1 = vec3(0.9882, 0.5686, 0.0196);
    vec3 color2 = vec3(1.0, 0.0, 0.0);

    vec3 mixColor = mix( color1, color2, 1.0 - vPosition.y );

    float area = distance( gl_PointCoord, vec2(0.5) );
    float strength = 0.04 / area - 0.1;

    gl_FragColor = vec4( mixColor, strength);
}