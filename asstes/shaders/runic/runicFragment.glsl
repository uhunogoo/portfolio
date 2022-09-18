uniform sampler2D uTexture;
uniform sampler2D uColorMap;
uniform float uFinal;
uniform float uTime;

// Varying
varying vec2 vUv;

void main() {
    vec2 st = vUv;

	vec3 color = vec3(0.0, 0.6, 1.0);
    vec3 image = texture2D( uTexture, st ).rgb;
	float yStep = ((1.0 + sin( uTime * 10.0 + (st.x + st.y) * 100.0) * cos( uTime * 10.0 + ((1.0 - st.x ) - (1.0 - st.y)) * 180.0)) / 2.0) * 0.2;
	vec2 wavy = vec2(
		cos(uTime * 6.0 + st.y * 40.0) * 0.001 * uFinal,
		sin(uTime * 6.0 + st.x * 180.0) * 0.001 * uFinal + yStep * 0.02 * uFinal
	);
    float colorMap = texture2D( uColorMap, st + wavy ).r;
	colorMap = 1.0 - abs(colorMap);
	colorMap = smoothstep( 0.1, 0.5, colorMap );
	colorMap = clamp(colorMap, 0.0, 1.0);

	vec3 mixedTexture = mix(image * (1.0 + 0.15 * uFinal), color * 1.2, colorMap);
    vec3 finalTexture = mix(image, mixedTexture, uFinal);
	

    gl_FragColor = vec4( finalTexture, 1.0);
}
