import * as THREE from "three"
import Experience from "../Experience.js"
import vertexShader from "../shaders/vertex.glsl"
import fragmentShader from "../shaders/fragment.glsl"

console.log(fragmentShader)

export default class Shape {
    constructor({
                    name = "Shape",
                    type = "box",
                    size = [1, 1, 1],
                    position = [0, 0, 0],
                    rotation = [0, 0, 0],
                    scale = [1, 1, 1],
                    color = "#ffffff",
                    useShader = false,
                    customShader = null,
                    uniforms = {},
                }) {
        this.name = name
        this.type = type
        this.experience = new Experience()
        this.environment = this.experience.environment
        this.scene = this.experience.scene
        this.debug = this.experience.debug
        this.time = this.experience.time

        // Transform properties
        this.size = new THREE.Vector3().fromArray(size)
        this.position = new THREE.Vector3().fromArray(position)
        this.rotation = new THREE.Euler().fromArray(rotation, "XYZ") // Default rotation order
        this.scale = new THREE.Vector3().fromArray(scale)

        this.color = new THREE.Color(color)
        this.shaders = customShader


        // Uniforms for shaders
        this.uniforms = {
            uTime: { value: 0 },
            uColor: { value: this.color },
            uLightPosition: { value: this.environment.sunLight.position },
            uLightColor: { value: new THREE.Color(1, 1, 1) },
            uLightIntensity: { value: this.environment.sunLight.intensity },
            ...uniforms,
        }

        // Create shape
        this.createGeometry(this.type, this.size)
        this.createMaterial(useShader, this.shaders, this.color)
        this.createMesh(this.position, this.rotation, this.scale)

        // Debug UI
        if (this.debug.active) {
            this.setDebugUI()
        }
    }

    createGeometry(type, size) {
        const [w, h, d] = size
        switch (type) {
            case "sphere":
                this.geometry = new THREE.SphereGeometry(w, 32, 32)
                break
            case "torus":
                this.geometry = new THREE.TorusGeometry(w, h, 16, 100)
                break
            case "plane":
                this.geometry = new THREE.PlaneGeometry(w, h)
                break
            default:
                this.geometry = new THREE.BoxGeometry(w, h, d)

        }
    }

    createMaterial(useShader, customShader, color) {
        if (useShader) {
            this.material = new THREE.ShaderMaterial({
                vertexShader: customShader?.vertex || vertexShader,
                fragmentShader: customShader?.fragment || fragmentShader,
                uniforms: this.uniforms,
            })
        } else {
            this.material = new THREE.MeshStandardMaterial({
                color,
                metalness: 0.5,
                roughness: 0.3,
            })
        }
    }

    createMesh(position, rotation, scale) {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.set(...position)
        this.mesh.rotation.copy(rotation)
        this.mesh.scale.copy(scale)
        this.scene.add(this.mesh)
    }

    setDebugUI() {
        this.debugFolder = this.debug.ui.addFolder(this.name)

        // Position Controls
        this.debugFolder.add(this.mesh.position, "x", -5, 5, 0.01).name("Position X").listen()
        this.debugFolder.add(this.mesh.position, "y", -5, 5, 0.01).name("Position Y").listen()
        this.debugFolder.add(this.mesh.position, "z", -5, 5, 0.01).name("Position Z").listen()

        // Rotation Controls
        this.debugFolder.add(this.mesh.rotation, "x", -Math.PI, Math.PI, 0.01).name("Rotation X").listen()
        this.debugFolder.add(this.mesh.rotation, "y", -Math.PI, Math.PI, 0.01).name("Rotation Y").listen()
        this.debugFolder.add(this.mesh.rotation, "z", -Math.PI, Math.PI, 0.01).name("Rotation Z").listen()

        // Scale Controls
        this.debugFolder.add(this.mesh.scale, "x", 0.1, 3, 0.01).name("Scale X").listen()
        this.debugFolder.add(this.mesh.scale, "y", 0.1, 3, 0.01).name("Scale Y").listen()
        this.debugFolder.add(this.mesh.scale, "z", 0.1, 3, 0.01).name("Scale Z").listen()

        // Color Picker
        this.debugFolder.addColor(this.uniforms.uColor, "value").name("Color").onChange((value) => {
            this.material.color.set(String(value))
        })

        // Wireframe Toggle
        this.debugFolder.add(this.material, "wireframe").name("Wireframe")

    }

    update() {
        if (this.material instanceof THREE.ShaderMaterial) {
            this.material.uniforms.uTime.value = this.time.elapsed
            this.material.uniforms.uLightIntensity.value = this.environment.sunLight.intensity
            this.material.needsUpdate = true
        }
    }

    destroy() {
        this.geometry.dispose()
        this.material.dispose()
        this.scene.remove(this.mesh)
    }
}