import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import Experience from "../Experience.js"
import { DotScreenPass, GammaCorrectionShader, GlitchPass, RGBShiftShader, ShaderPass, SMAAPass } from "three/addons"
import * as THREE from "three"


export default class PostProcessing {
    constructor() {
        this.active = false
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.sizes = this.experience.sizes
        this.renderer = this.experience.renderer

        const renderTarget = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height)
        this.effectComposer = new EffectComposer(this.renderer.instance, renderTarget)
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
        this.effectComposer.setPixelRatio(this.sizes.pixelRatio)


        this.effects = {
            render: { enabled: true, pass: new RenderPass(this.scene, this.camera.instance) },
            gammaCorrection: { enabled: false, pass: new ShaderPass(GammaCorrectionShader) },
            dotScreen: { enabled: false, pass: new DotScreenPass() },
            glitchPass: { enabled: false, pass: new GlitchPass() },
            rgbShift: { enabled: false, pass: new ShaderPass(RGBShiftShader) },
            smaa: { enabled: false, pass: new SMAAPass() },
        }


        this.toggleEffect("gammaCorrection", true)
        this.toggleEffect("smaa", true)
        
        this.addPasses()
        this.on()
    }

    on() {
        this.active = true
    }

    off() {
        this.active = false
    }

    addPasses() {
        this.effectComposer.passes = []
        Object.values(this.effects).forEach(({ enabled, pass }) => {
            if (enabled) {
                this.effectComposer.addPass(pass)
            }
        })
    }

    update() {
        if (this.active) {
            this.effectComposer.render()
        }
    }

    resize() {
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
        this.effectComposer.setPixelRatio(this.sizes.pixelRatio)
    }

    toggleEffect(effectName, enabled) {
        if (this.effects[effectName]) {
            this.effects[effectName].enabled = enabled
            this.addPasses()
        }
    }
}