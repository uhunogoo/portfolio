uniform float uProgress;

varying vec2 vUv;
varying float vSmog;

void main(){
	vec2 st = vUv;
	
	float progress = uProgress;
	st -= 1.2;
	float shape = sin( (st.x + st.y) / 2.0 + progress * 2.0 );
	shape = smoothstep(0.0, 0.5, shape + vSmog);
	shape = clamp(shape, 0.0, 1.0);
	
	
	gl_FragColor = vec4( vec3( 1.0 ), shape);
}