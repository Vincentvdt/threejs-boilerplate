import Experience from "../Experience.js"
import EventEmitter from "./EventEmitter.js"

export default class EventManager extends EventEmitter {
    constructor() {
        super()
        this.experience = new Experience()
        this.canvas = this.experience.canvas

        this.eventListeners = {}

        this.handleEvent = this.handleEvent.bind(this)

        this.canvas.addEventListener("mousemove", this.handleEvent)
        this.canvas.addEventListener("click", this.handleEvent)
        document.addEventListener("keydown", this.handleEvent)
        this.canvas.addEventListener("touchstart", this.handleEvent)

        // Raycaster
        this.raycaster = this.experience.raycaster
        this.intersectedObject = null
    }

    handleEvent(event) {
        switch (event.type) {
            case "mousemove":
                this.trigger("mousemove", [event])
                break
            case "click":
                this.trigger("click", [event])
                break
            case "keydown":
                this.trigger("keydown", [event])
                break
            case "touchstart":
                this.trigger("touchstart", [event])
                break
        }
    }

    addEventListener(eventType, callback) {
        if (!this.eventListeners[eventType]) {
            this.eventListeners[eventType] = []
        }
        this.eventListeners[eventType].push(callback)
        this.on(eventType, callback)
    }

    removeEventListener(eventType, callback) {
        if (this.eventListeners[eventType]) {
            const index = this.eventListeners[eventType].indexOf(callback)
            if (index > -1) {
                this.eventListeners[eventType].splice(index, 1)
                this.off(eventType, callback)
            }
        }
    }

    destroy() {
        // Clean up event listeners when the manager is destroyed
        this.canvas.removeEventListener("mousemove", this.handleEvent)
        this.canvas.removeEventListener("click", this.handleEvent)
        this.canvas.removeEventListener("keydown", this.handleEvent)
        this.canvas.removeEventListener("touchstart", this.handleEvent)
    }

}