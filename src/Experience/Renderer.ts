import * as THREE from "three";
import Experience from "@/Experience/Experience.ts";
import Sizes from "@/Experience/Utils/Sizes.ts";
import Camera from "@/Experience/Camera.ts";
import Manageable from "@/Experience/Utils/Manageable.ts";

export default class Renderer implements Manageable {
    public instance!: THREE.WebGLRenderer;
    private readonly canvas: HTMLCanvasElement;
    private readonly sizes: Sizes;
    private readonly scene: THREE.Scene;
    private readonly camera: Camera;

    constructor() {
        this.canvas = Experience.canvas;
        this.sizes = Experience.sizes;
        this.scene = Experience.scene;
        this.camera = Experience.camera;

        this.setInstance();
    }

    public resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    public update() {
        this.instance.render(this.scene, this.camera.instance);
    }

    public destroy(): void {
        this.instance.dispose();
    }

    private setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        });
        this.instance.toneMapping = THREE.CineonToneMapping;
        this.instance.toneMappingExposure = 1.75;
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
        this.instance.setClearColor("#211d20");
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }
}