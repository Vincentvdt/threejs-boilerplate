import * as THREE from "three"
import Shape from "../Utils/Shape.js"

export class Sphere extends Shape {
    constructor(params) {
        super(params)
        this.speed = 0.05
        this.keysPressed = this.experience.keysPressed
    }

    update() {
        super.update()

        if (this.keysPressed.has(" ")) this.mesh.position.y += this.speed
        if (this.keysPressed.has("shift")) this.mesh.position.y -= this.speed
        if (this.keysPressed.has("q")) this.mesh.position.x -= this.speed
        if (this.keysPressed.has("d")) this.mesh.position.x += this.speed
        if (this.keysPressed.has("z")) this.mesh.position.z -= this.speed
        if (this.keysPressed.has("s")) this.mesh.position.z += this.speed
    }
}