import * as THREE from "three";
import Camera from "@/Experience/Camera.ts";
import Renderer from "@/Experience/Renderer.ts";
import Sizes from "@/Experience/Utils/Sizes.ts";
import Experience from "@/Experience/Experience.ts";
import { EffectComposer, Pass } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import Manageable from "@/Experience/Utils/Manageable.ts";

export default class PostProcessing implements Manageable {
    public instance!: EffectComposer;
    private readonly scene: THREE.Scene;
    private readonly camera: Camera;
    private readonly sizes: Sizes;
    private readonly renderer: Renderer;
    private readonly effects: Record<string, { enabled: boolean; pass: Pass }>;

    constructor() {
        this.scene = Experience.scene;
        this.camera = Experience.camera;
        this.sizes = Experience.sizes;
        this.renderer = Experience.renderer;


        // Effect passes
        this.effects = {
            render: { enabled: true, pass: new RenderPass(this.scene, this.camera.instance) },
            gammaCorrection: { enabled: false, pass: new ShaderPass(GammaCorrectionShader) },
            dotScreen: { enabled: false, pass: new DotScreenPass() },
            glitch: { enabled: false, pass: new GlitchPass() },
            rgbShift: { enabled: false, pass: new ShaderPass(RGBShiftShader) },
            smaa: { enabled: false, pass: new SMAAPass(this.sizes.width, this.sizes.height) },
        };

        this.setInstance();

    }

    public get isActive(): boolean {
        return Object.values(this.effects).some(effect => effect.enabled);
    }


    /** Enables a post-processing effect */
    public enableEffect(effectName: keyof typeof this.effects): void {
        if (this.effects[effectName]) {
            this.effects[effectName].enabled = true;
            this.rebuildPasses();
        }
    }

    /** Disables a post-processing effect */
    public disableEffect(effectName: keyof typeof this.effects): void {
        if (this.effects[effectName]) {
            this.effects[effectName].enabled = false;
            this.rebuildPasses();
        }
    }

    /** Toggles a post-processing effect */
    public toggleEffect(effectName: keyof typeof this.effects): void {
        if (this.effects[effectName]) {
            this.effects[effectName].enabled = !this.effects[effectName].enabled;
            this.rebuildPasses();
        }
    }

    public update() {
        this.instance.render();
    }

    public resize(): void {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    public destroy() {
        this.instance.dispose();
    }

    /** Setup EffectComposer with an initial render target */
    private setInstance() {
        const renderTarget = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height);
        this.instance = new EffectComposer(this.renderer.instance, renderTarget);
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);

        this.enableEffect("gammaCorrection");
        this.enableEffect("smaa");
        this.rebuildPasses();
    }

    /** Adds enabled passes to the effect composer */
    private rebuildPasses(): void {
        this.instance.passes = [];
        Object.values(this.effects).forEach(({ enabled, pass }) => {
            if (enabled) this.instance.addPass(pass);
        });
    }


}