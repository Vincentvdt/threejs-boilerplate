import Shape from "../Utils/Shape.ts";

export class Torus extends Shape {
    private initialColor: string;

    constructor(params) {
        super(params);

        this.initialColor = this.material.color.clone();

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);

        if (this.listenEvents) this.onEvents();
    }

    onMouseEnter() {
        this.material.color.set("red");
    }

    onMouseLeave() {
        this.material.color.copy(this.initialColor); // Restore original color
    }

    update() {
        super.update();
        this.mesh.rotation.x += 0.05;
        this.mesh.rotation.y += 0.05;
    }

    onEvents() {
        this.on("mouseenter", this.onMouseEnter);
        this.on("mouseleave", this.onMouseLeave.bind(this));
    }

    offEvents() {
        this.off("mouseenter", this.onMouseEnter);
        this.off("mouseleave", this.onMouseLeave);
    }

    destroy() {
        super.destroy();
        this.offEvents();
    }

    private onColorChange(color: string) {
        this.initialColor = color;
    }
}