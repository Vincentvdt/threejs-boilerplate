precision mediump float;

varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uColor;
uniform vec3 uLightPosition;
uniform vec3 uLightColor;
uniform float uLightIntensity;// Add the light intensity uniform

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(uLightPosition - vPosition);
    float diffuse = max(dot(normal, lightDir), 0.0);

    // Adjust the final color with the light intensity
    vec3 finalColor = uColor * (0.2 + diffuse * 0.8 * uLightColor * uLightIntensity);// Ambient + diffuse

    gl_FragColor = vec4(finalColor, 1.0);
}
