precision mediump float;

varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;

void main() {
    // Transform normal to world space
    vNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);

    // Apply animation to the position (make it move up/down)
    vec3 animatedPosition = position;
    animatedPosition.y += sin(uTime * 0.01 + position.x * 2.0) * 0.2;// Sine wave movement

    // Convert to world position (needed for lighting)
    vPosition = (modelMatrix * vec4(animatedPosition, 1.0)).xyz;

    // Final position
    gl_Position = projectionMatrix * viewMatrix * vec4(vPosition, 1.0);
}
