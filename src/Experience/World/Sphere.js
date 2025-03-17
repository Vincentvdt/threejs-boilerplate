import Shape from "../Utils/Shape.js"

export class Sphere extends Shape {
    constructor(params) {
        super(params)
        this.scales = this.mesh.scale.clone()


        this.onClick = this.onClick.bind(this)
        if (this.listenEvents) this.onEvents()
    }

    onClick() {
        if (this.mesh.scale.equals(this.scales)) {
            this.mesh.scale.set(4, 4, 4)
        } else {
            this.mesh.scale.copy(this.scales)
        }
    }

    onEvents() {
        this.on("click", this.onClick)
    }

    offEvents() {
        this.off("click", this.onClick)
    }

    update() {
        super.update()
    }
}