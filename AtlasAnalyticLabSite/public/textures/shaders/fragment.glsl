uniform sampler2D spheretexture;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying float vDisplacment;





void main(){

 
    
    gl_FragColor = vec4(vec3(vDisplacment)* texture2D(spheretexture,vUv).xyz, 1.0);
    //gl_FragColor = vec4(texture2D(spheretexture,vUv).xyz, 1.0);
}