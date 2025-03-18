import * as THREE from "three";
import EventManager from "@/Experience/Utils/EventManager.ts";
import Mouse from "@/Experience/Utils/Mouse.ts";
import Debug from "@/Experience/Utils/Debug.ts";
import Sizes from "@/Experience/Utils/Sizes.ts";
import Time from "@/Experience/Utils/Time.ts";
import Camera from "@/Experience/Camera.ts";
import Renderer from "@/Experience/Renderer.ts";
import PostProcessing from "@/Experience/PostProcessing.ts";
import Environment from "@/Experience/World/Environment.ts";
import World from "@/Experience/World/World.ts";
import Manageable from "@/Experience/Utils/Manageable.ts";
import Raycaster from "@/Experience/Utils/Raycaster.ts";


let instance: Experience | null = null;

export default class Experience implements Manageable {
    public canvas!: HTMLCanvasElement;
    public eventManager!: EventManager;
    public mouse!: Mouse;
    public debug!: Debug;
    public sizes!: Sizes;
    public time!: Time;
    public scene!: THREE.Scene;
    public camera!: Camera;
    public renderer!: Renderer;
    public postProcessing!: PostProcessing;
    public environment!: Environment;
    public world!: World;
    public raycaster!: Raycaster;

    constructor(_canvas?: HTMLCanvasElement) {
        // Singleton
        if (instance) {
            return instance;
        }
        instance = this;

        // Global access
        window.experience = this;

        // Options
        if (_canvas) {
            this.canvas = _canvas;
        }

        // Setup
        this.eventManager = new EventManager();
        this.mouse = new Mouse();
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.postProcessing = new PostProcessing();
        this.environment = new Environment();
        this.world = new World();
        this.raycaster = new Raycaster();

        this.enableEvents();
    }

    // Static getters for easy access to singleton properties
    static get eventManager(): EventManager {
        return this.getInstance().eventManager;
    }

    static get mouse(): Mouse {
        return this.getInstance().mouse;
    }

    static get debug(): Debug {
        return this.getInstance().debug;
    }

    static get sizes(): Sizes {
        return this.getInstance().sizes;
    }

    static get time(): Time {
        return this.getInstance().time;
    }

    static get scene(): THREE.Scene {
        return this.getInstance().scene;
    }

    static get canvas(): HTMLCanvasElement {
        return this.getInstance().canvas;
    }

    static get camera(): Camera {
        return this.getInstance().camera;
    }

    static get renderer(): Renderer {
        return this.getInstance().renderer;
    }

    static get postProcessing(): PostProcessing {
        return this.getInstance().postProcessing;
    }

    static get environment(): Environment {
        return this.getInstance().environment;
    }

    static get world(): World {
        return this.getInstance().world;
    }

    static get raycaster(): Raycaster {
        return this.getInstance().raycaster;
    }

    // Static method to get the instance
    public static getInstance(_canvas?: HTMLCanvasElement): Experience {
        if (!instance) {
            if (!_canvas) {
                throw new Error("Canvas element must be provided the first time Experience is instantiated.");
            }
            new Experience(_canvas);
        }
        return instance!;
    }

    // Resize, update, and destroy methods
    public resize() {
        this.camera.resize();
        if (this.postProcessing.isActive) {
            this.postProcessing.resize();
        }
        this.renderer.resize();

    }

    public update() {
        this.camera.update();
        this.world.update();
        if (this.postProcessing.isActive) {
            this.postProcessing.update();
        }
        this.renderer.update();

        this.raycaster.update();
    }

    public destroy() {
        try {
            this.disableEvents();

            this.scene.traverse((child) => {
                if (child.type === "Mesh") {
                    (child as THREE.Mesh).geometry.dispose();
                    Object.values((child as THREE.Mesh).material).forEach((value) => {
                        value?.dispose?.();
                    });
                } else if (child instanceof THREE.Light) {
                    child.dispose();
                }
            });

            this.camera.destroy();
            this.renderer.destroy();
            this.postProcessing.destroy();

            if (this.debug.isActive) {
                this.debug.destroy();
            }
        } catch (error) {
            console.error("Error during cleanup: ", error);
        }
    }

    // Methods to enable or disable event listening
    enableEvents() {
        this.sizes.on("resize", this.resize.bind(this));
        this.time.on("tick", this.update.bind(this));
    }

    disableEvents() {
        this.sizes.off("resize");
        this.time.off("tick");
    }

}
