uniform sampler2D uTexture;
uniform sampler2D uColorMap;
uniform float uFinal;
uniform float uTime;

// Varying
varying vec2 vUv;

void main() {
    vec2 st = vUv;

	vec3 color = vec3(1.0, 0.902, 0.0);
    vec3 image = texture2D( uTexture, st ).rgb;
	vec2 wavy = vec2(
		cos(uTime * 6.0 + st.y * 40.0) * 0.001 * uFinal,
		sin(uTime * 6.0 + st.x * 80.0) * 0.001 * uFinal
	);
    float colorMap = texture2D( uColorMap, st + wavy ).r;
	colorMap = 1.0 - colorMap;
	colorMap = clamp(colorMap, 0.0, 1.0);

	vec3 mixedTexture = mix(image * (1.0 + 0.15 * uFinal), color * 1.2, colorMap);
    vec3 finalTexture = mix(image, mixedTexture, uFinal);

    gl_FragColor = vec4( finalTexture, 1.0);
}
