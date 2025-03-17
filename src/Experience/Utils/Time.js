import EventEmitter from "./EventEmitter.js"
import Monitoring from "./Monitoring.js"

export default class Time extends EventEmitter {
    constructor() {
        super()

        // Setup
        this.start = Date.now()
        this.monitoring = new Monitoring(["fps", "ms", "mb"])
        this.current = this.start
        this.elapsed = 0
        this.delta = 16
        this.running = true

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick() {
        if (!this.running) return

        this.monitoring.begin()

        const currentTime = Date.now()
        this.delta = Math.min(currentTime - this.current, 100) // Clamping to prevent large jumps
        this.current = currentTime
        this.elapsed = this.current - this.start

        this.trigger("tick")

        this.monitoring.end()

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    stop() {
        this.running = false
    }

    startAgain() {
        if (!this.running) {
            this.running = true
            this.current = performance.now()
            requestAnimationFrame(this.tick)
        }
    }

}