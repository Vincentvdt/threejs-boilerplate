precision mediump float;

varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uColor;
uniform vec3 uLightPosition;
uniform vec3 uLightColor;
uniform float uLightIntensity;

void main() {
    // Normalize the normal vector
    vec3 normal = normalize(vNormal);

    // Compute the light direction in world space
    vec3 lightDir = normalize(uLightPosition - vPosition);

    // Compute diffuse lighting
    float diffuse = max(dot(normal, lightDir), 0.0);

    // Adjust the final color with ambient and diffuse lighting
    vec3 finalColor = uColor * (0.2 + diffuse * 0.8 * uLightColor * uLightIntensity);// Ambient + diffuse

    gl_FragColor = vec4(finalColor, 1.0);
}
