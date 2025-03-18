import * as THREE from "three";

import vertexShader from "@/Experience/shaders/vertex.glsl";
import fragmentShader from "@/Experience/shaders/fragment.glsl";

import Manageable from "@/Experience/Utils/Manageable.ts";
import Experience from "@/Experience/Experience.ts";
import EventEmitter from "@/Experience/Utils/EventEmitter.ts";
import World from "@/Experience/World/World.ts";
import Environment from "@/Experience/World/Environment.ts";
import Time from "@/Experience/Utils/Time.ts";
import Debug from "@/Experience/Utils/Debug.ts";
import { GUI } from "lil-gui";
import { toEuler, toVector3 } from "@/Experience/Utils/Helper.ts";

type Geometry = "sphere" | "torus" | "plane"

interface IShader {
    vertex: string;
    fragment: string;
}

interface IUniform {
    value: any;
}

export interface IShapeOptions {
    name?: string;
    type?: string;
    size?: [ number, number, number ];
    position?: [ number, number, number ];
    rotation?: [ number, number, number ];
    scale?: [ number, number, number ];
    color?: string;
    useShader?: boolean;
    customShader?: IShader | null;
    uniforms?: { [key: string]: IUniform };
    world?: World;
    listenEvents?: boolean;
}

export default abstract class Shape extends EventEmitter implements Manageable {
    name: string;
    type: string;
    size: THREE.Vector3;
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
    color: THREE.Color;
    isShaderMaterial: boolean;
    shaders: IShader | null;
    uniforms: { [key: string]: IUniform };
    mesh: THREE.Mesh;
    geometry: THREE.Geometry | THREE.BufferGeometry;
    material: THREE.Material;
    world: World;
    listenEvents: boolean;
    scene: THREE.Scene;
    time: Time;
    environment: Environment;
    debug: Debug;
    debugFolder: GUI;

    protected constructor({
        name = "Shape",
        type = "box",
        size = [ 1, 1, 1 ],
        position = [ 0, 0, 0 ],
        rotation = [ 0, 0, 0 ],
        scale = [ 1, 1, 1 ],
        color = "#ffffff",
        useShader = false,
        customShader = null,
        uniforms = {},
        world = null,
        listenEvents = false,
    }: IShapeOptions) {
        super();

        this.name = name;
        this.type = type;
        this.scene = Experience.scene;
        this.time = Experience.time;
        this.world = world;
        this.environment = Experience.environment;
        this.debug = Experience.debug;

        this.size = toVector3(size);
        this.position = toVector3(position);
        this.rotation = toEuler(rotation);
        this.scale = toVector3(scale);

        this.color = new THREE.Color(color);
        this.isShaderMaterial = useShader;
        this.shaders = customShader;

        this.uniforms = {
            uTime: { value: 0 },
            uColor: { value: this.color },
            uLightPosition: { value: this.environment.sunLight.position },
            uLightColor: { value: new THREE.Color(1, 1, 1) },
            uLightIntensity: { value: this.environment.sunLight.intensity },
            ...uniforms,
        };

        this.createGeometry(type, size);
        this.createMaterial();
        this.createMesh();

        this.setDebugUI();
        this.listenEvents = listenEvents;
    }

    public init() {
        this.scene.add(this.mesh);
    }

    public update() {
        if (this.material instanceof THREE.ShaderMaterial) {
            this.material.uniforms.uTime.value = this.time.elapsed;
            this.material.uniforms.uLightIntensity.value = this.environment.sunLight.intensity;
            this.material.needsUpdate = true;
        }
    }

    public destroy() {
        this.geometry.dispose();
        this.material.dispose();
        this.scene.remove(this.mesh);
    }

    private addDebugColorControls() {
        this.debugFolder?.addColor(this, "color").name("Color").onChange((color: string) => {
            const newColor = new THREE.Color(color);
            if (this.isShaderMaterial) {
                this.uniforms.uColor.value = newColor;
            } else {
                this.material.color.set(newColor);
            }
            this.onColorChange(color);
        });
    }

    private onColorChange(color: string) {

    }

    private addDebugMaterialControls() {
        if (!this.isShaderMaterial) {
            this.debugFolder?.add(this.material, "metalness", 0, 1, 0.01).name("Metalness").listen();
            this.debugFolder?.add(this.material, "roughness", 0, 1, 0.01).name("Roughness").listen();
        }
        this.debugFolder?.add(this.material, "wireframe").name("Wireframe");
    }


    private setDebugUI() {
        if (!this.debug.isActive) return;

        this.debugFolder = this.debug.ui.addFolder(this.name);

        this.addDebugPositionControls();
        this.addDebugRotationControls();
        this.addDebugScaleControls();
        this.addDebugColorControls();
        this.addDebugMaterialControls();
    }

    private addDebugPositionControls() {
        this.debugFolder?.add(this.mesh.position, "x", -5, 5, 0.01).name("Position X").listen();
        this.debugFolder?.add(this.mesh.position, "y", -5, 5, 0.01).name("Position Y").listen();
        this.debugFolder?.add(this.mesh.position, "z", -5, 5, 0.01).name("Position Z").listen();
    }

    private addDebugRotationControls() {
        this.debugFolder?.add(this.mesh.rotation, "x", -Math.PI, Math.PI, 0.01).name("Rotation X").listen();
        this.debugFolder?.add(this.mesh.rotation, "y", -Math.PI, Math.PI, 0.01).name("Rotation Y").listen();
        this.debugFolder?.add(this.mesh.rotation, "z", -Math.PI, Math.PI, 0.01).name("Rotation Z").listen();
    }

    private addDebugScaleControls() {
        this.debugFolder?.add(this.mesh.scale, "x", 0.1, 5, 0.01).name("Scale X").listen();
        this.debugFolder?.add(this.mesh.scale, "y", 0.1, 5, 0.01).name("Scale Y").listen();
        this.debugFolder?.add(this.mesh.scale, "z", 0.1, 5, 0.01).name("Scale Z").listen();
    }

    private createMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.copy(this.position);
        this.mesh.rotation.copy(this.rotation);
        this.mesh.scale.copy(this.scale);
    }

    private createMaterial() {
        if (this.isShaderMaterial) {
            this.material = new THREE.ShaderMaterial({
                vertexShader: this.shaders?.vertex || vertexShader,
                fragmentShader: this.shaders?.fragment || fragmentShader,
                uniforms: this.uniforms,
            });
        } else {
            this.material = new THREE.MeshStandardMaterial({
                color: this.color,
                metalness: 0.5,
                roughness: 0.3,
            });
        }
    }

    private createGeometry(type: Geometry, size: THREE.Vector3) {
        const [ w, h, d ] = size;
        switch (type) {
            case "sphere":
                this.geometry = new THREE.SphereGeometry(w, 32, 32);
                break;
            case "torus":
                this.geometry = new THREE.TorusGeometry(w, h, 16, 100);
                break;
            case "plane":
                this.geometry = new THREE.PlaneGeometry(w, h);
                break;
            default:
                this.geometry = new THREE.BoxGeometry(w, h, d);
        }
    }
}