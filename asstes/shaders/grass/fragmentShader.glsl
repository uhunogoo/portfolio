varying vec2 vUv;
varying float vNoise;
varying vec2 vPosition;

uniform vec3 uColor1;
uniform vec3 uColor2;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

mat2 get2dRotateMatrix(float _angle) {
		return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
}

void main() {
    vec2 st = vUv;
    
    vec3 color1 = uColor1;
    vec3 color2 = uColor2;

    vec3 finalColor = mix( color1, color2, (abs( 1.0 - length(st.x - 0.5) ) * (1.0 - st.y * 2.0)) * 2.5 + vNoise - 1.0 );
    float noise = clamp(vNoise, 0.0, 1.0);

    // Shadow imitation

    // Tower shadow
    vec2 topShadowPosition = vec2(-0.254, 0.13);
    float topShadowSize = 0.213;
    vec2 bottomShadowPosition = vec2(-0.106, -0.03);
    float bottomShadowSize = 0.373;
    // FirePlace shadow
    vec2 fireShadowPosition = vec2(0.53, -0.327);
    float fireShadowSize = 0.1;
    // Steps shadow
    vec2 stepsShadowPosition = vec2(0.115, 0.164);
    float stepsShadowSize = 0.09;

    // TowerShadow
    float shadow1 = length(vPosition - 0.5 - bottomShadowPosition);
    shadow1 = 1.0 - smoothstep( bottomShadowSize - 0.03, bottomShadowSize, shadow1 );
    float shadow2 = length(vPosition - 0.5 - topShadowPosition);
    shadow2 = 1.0 - smoothstep( topShadowSize - 0.01, topShadowSize, shadow2 );

    // Steps
    vec2 rotateUV = vPosition * get2dRotateMatrix(0.263);
    float shadow3 = 1.0 - step(stepsShadowSize, max(abs(rotateUV.x - 0.5 - stepsShadowPosition.x), abs(rotateUV.y - 0.5 - stepsShadowPosition.y)));

    // calculate tower shadow
    float towershadowIntersects = shadow1 * shadow2;
    float towerShadow = (shadow1 * 0.125 + shadow2 * 0.1) * (1.0 - towershadowIntersects) + towershadowIntersects * 0.15;
    towerShadow += shadow3 * 0.125;

    // Shadow near fire
    float shadow4 = length(vPosition - 0.5 - fireShadowPosition);
    shadow4 = 1.0 - smoothstep( fireShadowSize - 0.01, fireShadowSize, shadow4 );

    // Final calculation shadow
    float mixShadows = towerShadow + shadow4 * 0.15;

    

    //  Final color calcullation
    vec3 color = mix(finalColor, finalColor * 0.7, mixShadows * 10.0 );
    finalColor = mix( color, color - noise * 0.1 * st.y, noise );
    finalColor = clamp(finalColor, 0.0, 1.0);

    gl_FragColor = vec4( finalColor, 1.0);
}