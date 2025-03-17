import * as THREE from "three"
import Experience from "../Experience.js"
import EventEmitter from "./EventEmitter.js"

export default class Raycasting extends EventEmitter {
    constructor() {
        super()
        this.experience = new Experience()
        this.mouse = this.experience.mouse
        this.camera = this.experience.camera
        this.scene = this.experience.scene
        this.world = this.experience.world
        this.eventManager = this.experience.eventManager


        // Initialize the raycaster
        this.raycaster = new THREE.Raycaster()
        this.intersectedObject = null
        this.intersectedShape = null

        // Bind event handlers
        this.handleMouseMove = this.onMouseMove.bind(this)
        this.handleClick = this.onClick.bind(this)

        this.enable()
    }

    getIntersect() {
        const mouse = this.mouse.getNormalizedPosition()
        this.raycaster.setFromCamera(mouse, this.camera.instance)

        const objects = this.scene.children.filter(obj => obj instanceof THREE.Mesh)
        const intersects = this.raycaster.intersectObjects(objects, false)

        this.intersectedObject = intersects[0]?.object || null
        return this.intersectedObject
    }


    onMouseMove() {
        const intersect = this.getIntersect()

        if (intersect) {
            const shape = this.world.getShape(intersect)

            if (shape && this.intersectedShape !== shape) {
                if (this.intersectedShape) {
                    this.intersectedShape.trigger("mouseleave", [this.intersectedShape])
                }
                this.intersectedShape = shape
                this.intersectedShape.trigger("mouseenter", [this.intersectedShape])
            }
        } else {
            if (this.intersectedShape) {
                this.intersectedShape.trigger("mouseleave", [this.intersectedShape])
                this.intersectedShape = null

            }
        }
    }

    onClick() {
        const intersect = this.getIntersect()

        if (intersect) {
            const shape = this.world.getShape(intersect)
            if (shape) {
                this.intersectedShape = shape
                this.intersectedShape.trigger("click", [this.intersectedShape])
            }
        }
    }

    update() {
        // Optionally update anything continuously during each tick
    }


    enable() {
        if (this.active) return // Prevent duplicate listeners
        this.eventManager.addEventListener("mousemove", this.handleMouseMove)
        this.eventManager.addEventListener("click", this.handleClick)
        this.active = true
    }

    disable() {
        if (!this.active) return
        this.eventManager.removeEventListener("mousemove", this.handleMouseMove)
        this.eventManager.removeEventListener("click", this.handleClick)
        this.intersectedShape = null
        this.intersectedObject = null
        this.active = false
    }

    destroy() {
        this.disable()
        this.raycaster = null
    }
}
