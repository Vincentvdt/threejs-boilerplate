precision mediump float;

varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;

void main() {
    vNormal = normalMatrix * normal;// Transform normal to world space

    // Apply animation to the position (make it move up/down)
    vec3 animatedPosition = position;
    animatedPosition.y += sin(uTime * 0.01 + position.x * 2.0) * 0.2;// Sine wave movement

    // Convert to world position (needed for lighting)
    vPosition = (modelMatrix * vec4(animatedPosition, 1.0)).xyz;

    // Final position
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(animatedPosition, 1.0);
}
