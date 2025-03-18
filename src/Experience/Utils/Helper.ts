import * as THREE from "three";

/**
 * Converts an array of size 1, 2, or 3 into a THREE.Vector3.
 * @param input The input array, which can have 1, 2, or 3 values.
 * @returns A new THREE.Vector3 instance.
 */
export function toVector3(input: [ number, number?, number? ]): THREE.Vector3 {
    if (input.length === 1) {
        return new THREE.Vector3(input[0], input[0], input[0]);
    }

    if (input.length === 2) {
        return new THREE.Vector3(input[0], input[1], input[0]);
    }

    if (input.length === 3) {
        return new THREE.Vector3(input[0], input[1], input[2]);
    }

    return new THREE.Vector3(1, 1, 1);
}


/**
 * Converts an array of size 1, 2, or 3 into a THREE.Euler.
 * @param input The input array, which can have 1, 2, or 3 values.
 * @returns A new THREE.Euler instance.
 */
export function toEuler(input: [ number, number?, number? ]): THREE.Euler {
    if (input.length === 1) {
        return new THREE.Euler(input[0], input[0], input[0], "XYZ");
    }

    if (input.length === 2) {
        return new THREE.Euler(input[0], input[1], input[0], "XYZ");
    }

    if (input.length === 3) {
        return new THREE.Euler(input[0], input[1], input[2], "XYZ");
    }

    return new THREE.Euler(0, 0, 0, "XYZ"); // Default case
}
