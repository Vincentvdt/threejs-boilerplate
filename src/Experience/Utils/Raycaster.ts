import * as THREE from "three";
import EventEmitter from "@/Experience/Utils/EventEmitter.ts";
import Experience from "@/Experience/Experience.ts";
import World from "@/Experience/World/World.ts";
import EventManager from "@/Experience/Utils/EventManager.ts";
import Camera from "@/Experience/Camera.ts";
import Mouse from "@/Experience/Utils/Mouse.ts";
import Manageable from "@/Experience/Utils/Manageable.ts";
import Shape from "@/Experience/Utils/Shape.ts";


export default class Raycaster extends EventEmitter implements Manageable {
    private raycaster: THREE.Raycaster;
    private mouse: Mouse;
    private camera: Camera;
    private scene: THREE.Scene;
    private world: World;
    private eventManager: EventManager;
    private intersectedShape: Shape | null = null;

    private readonly handleMouseMove: () => void;
    private readonly handleClick: () => void;

    constructor() {
        super();
        this.mouse = Experience.mouse;
        this.camera = Experience.camera;
        this.scene = Experience.scene;
        this.world = Experience.world;
        this.eventManager = Experience.eventManager;

        this.raycaster = new THREE.Raycaster();

        // Bind event handlers
        this.handleMouseMove = this.onMouseMove.bind(this);
        this.handleClick = this.onClick.bind(this);

        this.enableEvents();
    }

    // Enable mouse and click event listeners
    public enableEvents(): void {
        this.eventManager.addEventListener("mousemove", this.handleMouseMove);
        this.eventManager.addEventListener("click", this.handleClick);
    }

    // Disable mouse and click event listeners
    public disableEvents(): void {
        this.eventManager.removeEventListener("mousemove", this.handleMouseMove);
        this.eventManager.removeEventListener("click", this.handleClick);
    }

    // Cleanup and dispose resources
    public destroy(): void {
        this.disableEvents();
        // No dispose method for Raycaster; you can clean any resources if needed
    }

    // Placeholder for continuous updates (if needed)
    public update(): void {
        // Optional continuous update logic (e.g., in an animation loop)
    }

    // Get the object that the raycaster intersects with
    private getIntersectedObject(): THREE.Object3D | null {
        const mousePosition = this.mouse.getNormalizedPosition();
        this.raycaster.setFromCamera(mousePosition, this.camera.instance);

        const intersectedObjects = this.scene.children.filter(
            (obj): obj is THREE.Mesh => obj.type === "Mesh", // Type assertion to narrow down the type
        );

        const intersects = this.raycaster.intersectObjects(intersectedObjects, false);
        return intersects[0]?.object || null;
    }

    // Handle mouse movement
    private onMouseMove(): void {
        const intersectedObject = this.getIntersectedObject();

        if (intersectedObject) {
            const shape = this.world.getShape(intersectedObject);

            if (shape && this.intersectedShape !== shape) {
                if (this.intersectedShape)
                    this.intersectedShape.trigger("mouseleave", [ this.intersectedShape ]);

                this.intersectedShape = shape;
                this.intersectedShape.trigger("mouseenter", [ this.intersectedShape ]);
            }
        } else if (this.intersectedShape) {
            this.intersectedShape.trigger("mouseleave", [ this.intersectedShape ]);
            this.intersectedShape = null;
        }
    }

    // Handle mouse click
    private onClick(): void {
        const intersectedObject = this.getIntersectedObject();

        if (intersectedObject) {
            const shape = this.world.getShape(intersectedObject);
            if (shape) {
                this.intersectedShape = shape;
                this.intersectedShape.trigger("click", [ this.intersectedShape ]);
            }
        }
    }
}
