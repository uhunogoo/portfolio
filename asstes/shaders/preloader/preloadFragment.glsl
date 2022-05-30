uniform float uProgress;
uniform float uAspect;

varying vec2 vUv;
varying float vSmog;

void main(){
	vec2 st = vUv;
	vec2 newUV = (st - 0.5) * vec2(uAspect, 1.0) + 0.5;
	
	float progress = uProgress;
	st -= 1.5;
	float shape = sin( (st.x + st.y) / 2.0 + progress * 3.0 );

	newUV = mix( (newUV - 0.5) / 8.0 + 0.5, newUV, progress);
	float circle = length(newUV - 0.5);
	// circle = smoothstep( 0.9, -0.1, circle );
	float circleShape = smoothstep( 0.0 - progress * 0.5, 1.0 - progress * 0.7, circle );
	float circleShape2 = smoothstep( 0.0, 0.9, circle );

	shape = smoothstep(0.0, 0.45, circleShape * 2.5 + (vSmog - 1.0));
	shape += vSmog * (1.0 - progress) * shape;
	shape = clamp(shape, 0.0, 1.0);

	// shape = smoothstep(-0.1, 1.0, (vSmog + ((1.0 -circleShape2) + shape)) );
	
	
	gl_FragColor = vec4( vec3( 1.0 + shape ), shape);
	// gl_FragColor = vec4( vec3( mix(0.0, 1.0 +0.02 / (1.0 - abs(shape * 1.0) ), shape)), 1.0);
	// gl_FragColor = vec4( vec3(shape), 1.0);

}