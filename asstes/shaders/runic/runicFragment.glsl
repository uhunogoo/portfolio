uniform sampler2D uTexture;
uniform sampler2D uColorMap;
uniform float uFinal;
uniform float uTime;

// Varying
varying vec2 vUv;

void main() {
    vec2 st = vUv;

	vec3 color_1 = vec3(0.4745, 0.0588, 0.0039);
	vec3 color_2 = vec3(1.0, 0.3686, 0.0);
    vec3 image = texture2D( uTexture, st ).rgb;
	
	float yStep = ((1.0 + sin( uTime * 10.0 + (st.x + st.y) * 100.0) * cos( uTime * 10.0 + ((1.0 - st.x ) - (1.0 - st.y)) * 180.0)) / 2.0) * 0.2;
	vec2 wavy = vec2(
		cos(uTime * 6.0 + st.y * 40.0) * 0.001 * uFinal,
		sin(uTime * 6.0 + st.x * 180.0) * 0.001 * uFinal + yStep * 0.02 * uFinal
	);

    float colorMap = texture2D( uColorMap, st ).r;
	colorMap = 1.0 - colorMap;
	colorMap = smoothstep(0.3, 0.6, colorMap);
	colorMap = clamp(colorMap, 0.0, 1.0);

	vec3 mixedcolor = mix( color_2, color_2, (colorMap - 0.5) * 4.0 );
	vec3 mixedTexture = mix( image, mixedcolor, colorMap );
    vec3 finalTexture = mix(image, mixedTexture, uFinal);
    // vec3 finalTexture = mixedTexture;
	

    gl_FragColor = vec4( finalTexture, 1.0);
}
