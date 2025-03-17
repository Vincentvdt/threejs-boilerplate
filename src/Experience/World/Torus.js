import Shape from "../Utils/Shape.js"

export class Torus extends Shape {
    constructor(params) {
        super(params)
        this.rotationSpeed = 0.02
    }

    update() {
        super.update()
        this.mesh.rotation.x += this.rotationSpeed
        this.mesh.rotation.y += this.rotationSpeed
    }
}