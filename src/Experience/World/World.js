import * as THREE from "three"
import Shape from "../Utils/Shape.js"
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

        // Shapes
        this.shape = new Sphere({
            name: "My Sphere",
            type: "sphere",
            size: [1.5],
            position: [-2, 1, 0],
            color: "#0000ff",
            useShader: true,
        })

        this.shape2 = new Torus({
            name: "Torus",
            type: "torus",
            size: [1, 0.3],
            position: [2, 1, 0],
            color: "#00ff00",
            useShader: false,
        })

    }

    update() {
        this.shape.update()
        this.shape2.update()
    }

}