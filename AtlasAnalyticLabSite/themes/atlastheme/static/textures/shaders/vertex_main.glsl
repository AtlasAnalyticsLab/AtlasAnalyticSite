

    vec3 coordinates = normal;
    coordinates.y += uTime * 0.3;
    coordinates.x += uTime * 0.3;
    vec3 noisepattern = vec3(cnoise(coordinates));
    float smoothpattern = wavepattern(noisepattern) ; 

    vDisplacment = smoothpattern;
    float scalefactor = 0.75;
    float displacement = vDisplacment/ 3.0;
    
    vec3 newPosition = scalefactor * position +(position * displacement);
    vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
    vec4 projectedPosition = projectionMatrix * modelViewPosition;
    
    transformed = newPosition;
