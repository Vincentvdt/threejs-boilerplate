import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Experience from "@/Experience/Experience.ts";
import Sizes from "@/Experience/Utils/Sizes.ts";
import Manageable from "@/Experience/Utils/Manageable.ts";

export default class Camera implements Manageable {
    public instance!: THREE.PerspectiveCamera;
    public controls!: OrbitControls;
    private readonly canvas: HTMLCanvasElement;

    constructor() {
        this.canvas = Experience.canvas;
        const scene = Experience.scene;
        const sizes = Experience.sizes;

        this.setInstance(scene, sizes);
        this.setControls();
    }

    public resize() {
        const sizes = Experience.sizes;  // Get the sizes from the singleton
        this.instance.aspect = sizes.width / sizes.height;
        this.instance.updateProjectionMatrix();
    }

    public update() {
        this.controls.update();
    }

    public destroy(): void {
        this.controls.dispose();
    }

    private setInstance(scene: THREE.Scene, sizes: Sizes) {
        this.instance = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
        this.instance.position.set(12, 8, 16);
        scene.add(this.instance);  // Add the camera to the scene
    }

    private setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
    }
}
