import * as THREE from "three";
import Experience from "@/Experience/Experience.ts";
import { Sphere } from "@/Experience/World/Sphere.ts";
import { Torus } from "@/Experience/World/Torus.ts";
import Shape from "@/Experience/Utils/Shape.ts";


export default class World {
    private scene: THREE.Scene;
    private shapesMap: Map<string, Shape>;

    constructor() {
        this.scene = Experience.scene;

        // Grid & Axes Helper
        this.scene.add(new THREE.GridHelper(10, 10));
        this.scene.add(new THREE.AxesHelper(2));

        this.shapesMap = new Map();

        // Add default shapes
        this.addShape(new Sphere({
            name: "My Sphere",
            type: "sphere",
            size: [ 1.5 ],
            position: [ -2, 1, 0 ],
            color: "#0000ff",
            useShader: true,
            world: this,
            listenEvents: true,
        }));

        this.addShape(new Torus({
            name: "Torus",
            type: "torus",
            size: [ 1, 0.3 ],
            position: [ 2, 1, 0 ],
            color: "#00ff00",
            useShader: false,
            world: this,
            listenEvents: true,
        }));
    }

    // Ensure object is valid and has an uuid before accessing the map
    public getShape(object: THREE.Object3D): Shape | null {
        if (!object.uuid) {
            console.warn("The provided object does not have a 'uuid' property");
            return null;
        }

        const shape = this.shapesMap.get(object.uuid);
        if (!shape) {
            console.warn("No shape found for the object with uuid:", object.uuid);
        }

        return shape || null;
    }

    // Add a single shape or multiple shapes
    public addShape(shape: Shape): void {
        shape.init();
        this.shapesMap.set(shape.mesh.uuid, shape);
    }

    public addShapes(shapes: Shape[]): void {
        shapes.forEach((shape) => this.addShape(shape));
    }

    public removeShape(shape: Shape): void {
        shape.destroy();
        this.shapesMap.delete(shape.mesh.uuid);
    }

    public update(): void {
        this.shapesMap.forEach((shape) => shape.update());
    }

}