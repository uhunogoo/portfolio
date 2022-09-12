uniform float uTime;
uniform float uIntensive;
uniform float uHeight;
uniform float uIntesity;

// varying
varying vec2 vUv;
varying vec2 vPosition;
varying float vNoise;
varying float vScale;
varying float vMultiply;
varying float vWind;

attribute vec3 offset;
attribute vec2 rotation;
attribute float scale;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

mat2 get2dRotateMatrix(float _angle){
	return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));
}

// Simplex 2D noise
//
vec4 permute(vec4 x){return mod(((x*34.)+1.)*x,289.);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
vec2 fade(vec2 t){return t*t*t*(t*(t*6.-15.)+10.);}

float cnoise(vec2 P){
	vec4 Pi=floor(P.xyxy)+vec4(0.,0.,1.,1.);
	vec4 Pf=fract(P.xyxy)-vec4(0.,0.,1.,1.);
	Pi=mod(Pi,289.);// To avoid truncation effects in permutation
	vec4 ix=Pi.xzxz;
	vec4 iy=Pi.yyww;
	vec4 fx=Pf.xzxz;
	vec4 fy=Pf.yyww;
	vec4 i=permute(permute(ix)+iy);
	vec4 gx=2.*fract(i*.0243902439)-1.;// 1/41 = 0.024...
	vec4 gy=abs(gx)-.5;
	vec4 tx=floor(gx+.5);
	gx=gx-tx;
	vec2 g00=vec2(gx.x,gy.x);
	vec2 g10=vec2(gx.y,gy.y);
	vec2 g01=vec2(gx.z,gy.z);
	vec2 g11=vec2(gx.w,gy.w);
	vec4 norm=1.79284291400159-.85373472095314*
	vec4(dot(g00,g00),dot(g01,g01),dot(g10,g10),dot(g11,g11));
	g00*=norm.x;
	g01*=norm.y;
	g10*=norm.z;
	g11*=norm.w;
	float n00=dot(g00,vec2(fx.x,fy.x));
	float n10=dot(g10,vec2(fx.y,fy.y));
	float n01=dot(g01,vec2(fx.z,fy.z));
	float n11=dot(g11,vec2(fx.w,fy.w));
	vec2 fade_xy=fade(Pf.xy);
	vec2 n_x=mix(vec2(n00,n01),vec2(n10,n11),fade_xy.x);
	float n_xy=mix(n_x.x,n_x.y,fade_xy.y);
	return 2.3*n_xy;
}

void main(){
	float intesity=uIntesity;
	
	float noise=cnoise(offset.xz/vec2(1.5,7.)+vec2(0.,uTime*.6));
	
	// Wind calculation
	float wind=sin((offset.x*4.-cos(offset.z*2.))/2.);
	wind+=cos((offset.z*2.-cos(offset.x*6.))/2.+uTime*2.5);
	wind=mix(0.,1.,wind*2.5+(noise-1.));
	
	float staticNoise=1.-abs(cnoise(offset.xz/vec2(5.,10.)));
	float staticNoise2=1.-cnoise(offset.xz/vec2(.5,.8));
	
	// generate small grass around the road
	vec2 groundUV = ( offset.xz - 0.5 ) / ( 11.78 * 0.5 ) + .5;
	// vec2 shadowNewUV= (vPosition - 0.5) / 2.0 + 0.5;
	float shadow = smoothstep( 0.1, 0.2 * scale, length(groundUV.y - 0.415) );
	// shadow *= ;
	// Scaling
	vec3 st=position*scale;
	st*=.5+staticNoise;
	st*=clamp(staticNoise2,scale*.4+(staticNoise*staticNoise2),1.);
	st.x*=6.-staticNoise2+scale;
	st.y*=uHeight;
	float scaleRoad = mix(1.0, 1.0 - clamp(1.0 - shadow + scale * rotation.y * 0.4, 0.0, 1.0) * 0.75 * staticNoise2, step( 0.5, groundUV.x ));
	st *= scaleRoad;
	st.x *= 2.2 - scaleRoad;
	st.y+=.01;
	
	// Base rotation
	st.zy*=get2dRotateMatrix( PI * rotation.y * 0.1 );
	st.xz*=get2dRotateMatrix( PI * 0.5 + (rotation.y + staticNoise2) * 0.5);
	// st.xz*=get2dRotateMatrix( (PI*rotation.y+staticNoise2));
	// st.xy*=get2dRotateMatrix((rotation.y+staticNoise2)*.05);
	// st.zy*=get2dRotateMatrix(sin(rotation.y*2.)*staticNoise2*.2);
	
	// Wind grass moving
	float newWind=((1.+wind)*.5);
	st.zy*=get2dRotateMatrix(((1.0 - abs(rotation.y)) * .2 - newWind * intesity ) * shadow );
	st.xy *= get2dRotateMatrix( (rotation.x + PI * 0.05) * 0.2 * newWind * intesity);
	
	st+=offset;
	
	vec4 modelPosition=modelMatrix*vec4(st,1.);
	vec4 viewPosition=viewMatrix*modelPosition;
	vec4 projectionPosition=projectionMatrix*viewPosition;
	
	gl_Position=projectionPosition;
	
	// Varuing
	vUv=uv;
	vNoise=clamp(wind,0.,1.)*.1+staticNoise;
	vWind=noise;
	vPosition=(offset.xz-.5)/(11.78*.5)+.5;
	
	vScale=scale;
	vMultiply=clamp(staticNoise2,scale*.4+(staticNoise*staticNoise2),1.);
}
