import * as THREE from "three"

import Debug from "./Utils/Debug"
import Sizes from "./Utils/Sizes"
import Time from "./Utils/Time"
import Camera from "./Camera"
import Renderer from "./Renderer"
import World from "./World/World"
import Environment from "./World/Environment.js"
import Mouse from "./Utils/Mouse.js"
import Raycasting from "./Utils/Raycasting.js"
import EventManager from "./Utils/EventManager.js"
import PostProcessing from "./Utils/PostProcessing.js"

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

        // Setup
        this.eventManager = new EventManager()
        this.mouse = new Mouse()
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        // this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.postProcessing = new PostProcessing()
        this.postProcessing.off()
        this.environment = new Environment()
        this.world = new World()
        this.raycaster = new Raycasting()

        // Resize event
        this.sizes.on("resize", () => {
            this.resize()
        })

        // Time tick event
        this.time.on("tick", () => {
            this.update()
        })
    }


    resize() {
        this.camera.resize()
        if (this.postProcessing.active) {
            this.postProcessing.resize()
        } else {
            this.renderer.resize()
        }
    }

    update() {
        this.camera.update()
        this.world.update()
        if (this.postProcessing.active) {
            this.postProcessing.update()
        } else {
            this.renderer.update()
        }
        this.raycaster.update()
    }

    destroy() {
        this.sizes.off("resize")
        this.time.off("tick")

        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()
                Object.values(child.material).forEach(value => {
                    if (value && typeof value.dispose === "function") {
                        value.dispose()
                    }
                })
            }
        })


        this.camera.controls.dispose()
        this.renderer.instance.dispose()
        this.postProcessing.effectComposer.dispose()

        if (this.debug.active)
            this.debug.ui.destroy()
    }
}