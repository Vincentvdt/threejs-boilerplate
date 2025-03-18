import * as THREE from "three";
import Experience from "@/Experience/Experience.ts";
import EventManager from "@/Experience/Utils/EventManager.ts";


export default class Mouse {
    public readonly mouse: THREE.Vector2;
    public readonly mousePosition: THREE.Vector2;
    private eventManager: EventManager;

    constructor() {
        this.mouse = new THREE.Vector2(0);
        this.mousePosition = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);

        this.eventManager = Experience.eventManager;

        this.eventManager.addEventListener("mousemove", this.onMouseMove.bind(this));
    }

    public getNormalizedPosition() {
        return this.mouse;
    }

    public getPosition() {
        return this.mousePosition;
    }

    private onMouseMove = (event: MouseEvent) => {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;
    };
}
