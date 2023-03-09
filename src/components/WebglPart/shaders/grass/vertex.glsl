uniform float uTime;
uniform float uIntensive;
uniform float uHeight;
uniform float uIntesity;
uniform float uGrassAreaSize;

attribute vec3 offset;
attribute vec3 rotation;
attribute float scale;
attribute float textureType;

// varying
varying vec2 vUv;
varying vec2 vPosition;
varying float vNoise;
varying float vScale;
varying float vMultiply;
varying float vWind;
varying float vTextureType;
varying float vRotate;


#define PI 3.14159265359
#define TWO_PI 6.28318530718

mat2 get2dRotateMatrix(float _angle){
	return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));
}
vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
	 
    return vec2( (uv + mid) * get2dRotateMatrix( rotation ) - mid );
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
	vec2 groundUV = ( offset.xz - 0.5) / (uGrassAreaSize) + 0.5;
	
	float noise=cnoise(offset.xz / vec2(2.0, 1.5) - vec2(uTime * 0.6, 0.0));
	
	// Wind calculation
	float wind=sin((offset.x * 4.0 - cos( offset.z * 2.0 ) ) / 2.0 );
	wind += cos(( offset.z * 2.0 - cos( offset.x * 6.0 ) ) / 2.0 + uTime * 2.5 );
	wind = mix( 0.0, 1.0, wind * 2.5 + ( noise - 1.0));

	float bend = pow( cos(PI * (groundUV.x - 0.50) / 2.0), 3.5 + noise );
	wind = 1.0 - mod( groundUV.y * 5.0 + bend * PI * 0.5, 1.0 );
	wind = sin( wind * TWO_PI - uTime * (1.5 + intesity));
	
	float staticNoise = 1.0 - abs( cnoise( offset.xz / vec2(3.0, 4.0) ) );
	float staticNoise2 = 1.0 - cnoise( offset.xz / vec2( 0.1, 0.8 ) );
	
	// generate small grass around the road
	float shadow = smoothstep( 0.1,  0.2 + scale, length(groundUV.y - 0.415) );

	// Scaling
	vec3 st = position;
	vec2 scaleStrength = vec2( uv.x, uv.y ) ;
	scaleStrength *= 1.0 - staticNoise;
	scaleStrength *= clamp( staticNoise2, scale * ( staticNoise * staticNoise2 ), 1.0);

	// Apply scales
	st.xy = (st.xy + vec2(0.0, 0.075)) * (scale + uHeight) - vec2(0.0, 0.075);
	st.xy *= 1.0 + scaleStrength * 2.0;

	// Base rotation
	float normalX = normalize(offset.x);
	st.zy = rotate(
		st.zy,
		( PI * rotation.z ) * intesity,
		vec2(0.0, 0.075)
	);
	st.xz = rotate( 
		st.xz,
		PI * normalX * 0.055 + rotation.y * PI,
		vec2(0.0)
	);
	
	// st.xy*= get2dRotateMatrix( ( PI * rotation.x) );
	
	// Wind grass moving
	float newWind=( (1.0 + wind) * 0.5 );
	st.xy = rotate( 
		st.xy, 
		- wind * PI * normalX * intesity * uv.y, 
		vec2(-0.075, 0.075) 
	);
	st.xy = rotate( 
		st.xy, 
		sin((offset.x * offset.z) * 20.0 + uTime * 4.0) * 0.07, 
		vec2(-0.075, 0.075) 
	);
	st.zy = rotate(
		st.zy, 
		newWind * PI * intesity * 1.5,
		vec2(0.0, 0.075)
	);

	// Base transform
	st.y -= 0.05;
	st+=offset;
	
	vec4 modelPosition=modelMatrix*vec4(st,1.);
	vec4 viewPosition=viewMatrix*modelPosition;
	vec4 projectionPosition=projectionMatrix*viewPosition;
	
	gl_Position=projectionPosition;
	
	// Varuing
	vUv=uv;
	vNoise=clamp(wind,0.,1.)*.1+staticNoise;
	vWind=wind;
	vPosition = ( offset.xz - 0.5) / (uGrassAreaSize) + 0.5;
	vRotate = (normalize( rotation.y ) + 1.0) / 2.0;
	vTextureType = textureType;
	
	vScale = scale / 2.0;
	vMultiply= mix( 0.0, 1.0, (staticNoise * staticNoise2) * 2.0 - (staticNoise2) * 0.9 );
}