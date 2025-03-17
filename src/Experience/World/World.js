import * as THREE from "three"
import Experience from "../Experience.js"
import { Sphere } from "./Sphere.js"
import { Torus } from "./Torus.js"


export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene


        // Grid & Axes Helper
        this.scene.add(new THREE.GridHelper(10, 10))
        this.scene.add(new THREE.AxesHelper(2))

        this.shapesMap = new Map()

        // Shapes
        const shapes = [
            new Sphere({
                name: "My Sphere",
                type: "sphere",
                size: [1.5],
                position: [-2, 1, 0],
                color: "#0000ff",
                useShader: true,
                world: this,
                listenEvents: true,
            })
            , new Torus({
                name: "Torus",
                type: "torus",
                size: [1, 0.3],
                position: [2, 1, 0],
                color: "#00ff00",
                useShader: false,
                world: this,
                listenEvents: true,
            })]

        this.addShapes(shapes)


    }

    getShape(object) {
        if (!object.uuid) {
            console.warn("The provided object does not have a 'uuid' property")
            return null
        }
        return this.shapesMap.get(object.uuid)
    }

    addShapes(shapes) {
        shapes.forEach(shape => this.addShape(shape))
    }

    addShape(shape) {
        shape.init()
        this.shapesMap.set(shape.mesh.uuid, shape)
    }

    removeShape(shape) {
        shape.destroy()
        this.shapesMap.delete(shape.mesh.uuid)
    }

    update() {
        this.shapesMap.forEach(shape => shape.update())
    }


}