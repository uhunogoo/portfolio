uniform float uProgress;
uniform vec2 uAspect;

varying vec2 vUv;
varying float vSmog;

void main(){
	float progress = uProgress;
	vec2 st = vUv;
	st = (st -0.5) * uAspect + 0.5;
	vec2 newUV = mix( (st - 0.5) / 8.0 + 0.5, st, progress);
	

	float circle = length(newUV - 0.5);
	float circleShape = smoothstep( 0.0 - progress * 0.5, 1.0 - progress * 0.7, circle );

	float shape = smoothstep(0.0, 0.6, circleShape * 2.5 + (vSmog - 1.0));
	shape += vSmog * (1.0 - progress) * shape;
	shape = clamp(shape, 0.0, 1.0);
	

	float newSmog = ((vSmog * shape * 0.5 + 0.5));
	newSmog = smoothstep( -0.9, 0.5, newSmog );
	float clampSmog = clamp(newSmog, 0.0, 1.0);

	// gl_FragColor = vec4( vec3( 1.0 ), shape);
	gl_FragColor = vec4( vec3( clampSmog ), shape );
}