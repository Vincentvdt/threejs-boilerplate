import * as THREE from "three"
import Experience from "../Experience.js"

export default class Mouse {
    constructor() {
        this.mouse = new THREE.Vector2(0)
        this.mousePosition = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2)

        this.experience = new Experience()
        this.eventManager = this.experience.eventManager

        this.eventManager.addEventListener("mousemove", this.onMouseMove.bind(this))
    }

    onMouseMove = (event) => {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        this.mousePosition.x = event.clientX
        this.mousePosition.y = event.clientY
    }


    getNormalizedPosition() {
        return this.mouse
    }

    getPosition() {
        return this.mousePosition
    }
}
