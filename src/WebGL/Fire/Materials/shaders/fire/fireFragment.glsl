uniform sampler2D uTexture;

varying vec2 vUv;
varying float vOpacity;
varying vec3 vColor;
varying float vStrength;

void main() {
    vec2 st = vUv;

    vec4 fireTexture = texture2D( uTexture, st );

    // final
    gl_FragColor = vec4( fireTexture.rgb * vColor, vOpacity);

    #include <tonemapping_fragment>
	#include <encodings_fragment>
}
