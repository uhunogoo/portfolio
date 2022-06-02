uniform float uProgress;
uniform float uAspect;

varying vec2 vUv;
varying float vSmog;

void main(){
	vec2 st = vUv;
	vec2 newUV = (st - 0.5) * vec2(uAspect, 1.0) + 0.5;
	
	float progress = uProgress;

	newUV = mix( (newUV - 0.5) / 8.0 + 0.5, newUV, progress);
	float circle = length(newUV - 0.5);
	float circleShape = smoothstep( 0.0 - progress * 0.5, 1.0 - progress * 0.7, circle );

	float shape = smoothstep(0.0, 0.45, circleShape * 2.5 + (vSmog - 1.0));
	shape += vSmog * (1.0 - progress) * shape;
	shape = clamp(shape, 0.0, 1.0);
	
	
	gl_FragColor = vec4( vec3( 1.0 + shape ), shape);

}