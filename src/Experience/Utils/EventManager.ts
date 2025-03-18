// Define specific event types to ensure type safety
import Experience from "@/Experience/Experience.ts";
import EventEmitter from "@/Experience/Utils/EventEmitter.ts";
import Raycaster from "@/Experience/Utils/Raycaster.ts";
import Manageable from "@/Experience/Utils/Manageable.ts";

type EventType = "mousemove" | "click" | "keydown" | "touchstart";

export default class EventManager extends EventEmitter implements Manageable {
    private canvas: HTMLCanvasElement;
    private readonly eventListeners: Record<EventType, Function[]>;
    private raycaster: Raycaster;
    private intersectedObject: any;

    constructor() {
        super();
        this.canvas = Experience.canvas;
        this.raycaster = Experience.raycaster;

        this.eventListeners = {
            mousemove: [],
            click: [],
            keydown: [],
            touchstart: [],
        };

        // Binding event handler to maintain 'this' context
        this.handleEvent = this.handleEvent.bind(this);

        // Register event listeners
        this.addCanvasEventListeners();

        // Initialize raycaster and intersectedObject (You may want to type them better)
        this.intersectedObject = null;
    }

    public addEventListener(eventType: EventType, callback: Function): void {
        if (!this.eventListeners[eventType]) {
            this.eventListeners[eventType] = [];
        }

        this.eventListeners[eventType].push(callback);
        this.on(eventType, callback);
    }

    public removeEventListener(eventType: EventType, callback: Function): void {
        const listeners = this.eventListeners[eventType];
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
                this.off(eventType, callback);
            }
        }
    }

    public destroy(): void {
        this.disableEvents();
    }

    public disableEvents() {
        this.canvas.removeEventListener("mousemove", this.handleEvent);
        this.canvas.removeEventListener("click", this.handleEvent);
        document.removeEventListener("keydown", this.handleEvent);
        this.canvas.removeEventListener("touchstart", this.handleEvent);
    }

    public enableEvents() {
        this.canvas.addEventListener("mousemove", this.handleEvent);
        this.canvas.addEventListener("click", this.handleEvent);
        document.addEventListener("keydown", this.handleEvent);
        this.canvas.addEventListener("touchstart", this.handleEvent);
    }

    private addCanvasEventListeners(): void {
        this.enableEvents();
    }

    private handleEvent(event: Event): void {
        const eventType = event.type as EventType;

        if (this.eventListeners[eventType]) {
            this.trigger(eventType, [ event ]);
        }
    }

}