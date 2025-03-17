import * as THREE from "three"

import Debug from "./Utils/Debug"
import Sizes from "./Utils/Sizes"
import Time from "./Utils/Time"
import Camera from "./Camera"
import Renderer from "./Renderer"
import World from "./World/World"
import Resources from "./Utils/Resources"

import sources from "./sources"
import Environment from "./World/Environment.js"

let instance = null

export default class Experience {
    constructor(_canvas) {
        // Singleton
        if (instance) {
            return instance
        }
        instance = this

        // Global access
        window.experience = this

        // Options
        this.canvas = _canvas

        // Track pressed key
        this.keysPressed = new Set()
        this.setupInputHandling()

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        // this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.environment = new Environment()
        this.world = new World()


        // Resize event
        this.sizes.on("resize", () => {
            this.resize()
        })

        // Time tick event
        this.time.on("tick", () => {
            this.update()
        })
    }

    setupInputHandling() {
        window.addEventListener("keydown", (event) => {
            this.keysPressed.add(event.key.toLowerCase())
        })

        window.addEventListener("keyup", (event) => {
            this.keysPressed.delete(event.key.toLowerCase())
        })
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }

    destroy() {
        this.sizes.off("resize")
        this.time.off("tick")

        // Traverse the whole scene
        this.scene.traverse((child) => {
            // Test if it's a mesh
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                // Loop through the material properties
                for (const key in child.material) {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if (value && typeof value.dispose === "function") {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if (this.debug.active)
            this.debug.ui.destroy()
    }
}