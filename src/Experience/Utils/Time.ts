import Monitoring from "@/Experience/Utils/Monitoring.ts";
import EventEmitter from "@/Experience/Utils/EventEmitter.ts";

export default class Time extends EventEmitter {
    private monitoring: Monitoring;
    private readonly start: number;
    private current: number;
    private elapsed: number;
    private delta: number;
    private running: boolean;

    constructor() {
        super();

        this.start = performance.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16;
        this.running = true;
        this.monitoring = new Monitoring([ 0, 1 ]); // Enable FPS & MS panels

        requestAnimationFrame(this.tick);
    }

    public stop(): void {
        this.running = false;
    }

    public startAgain(): void {
        if (!this.running) {
            this.running = true;
            this.current = performance.now();
            requestAnimationFrame(this.tick);
        }
    }

    // Getter for elapsed time
    public getElapsedTime(): number {
        return this.elapsed;
    }

    // Getter for delta time (time between ticks)
    public getDeltaTime(): number {
        return this.delta;
    }

    // Getter for the running state
    public isRunning(): boolean {
        return this.running;
    }

    private tick = (): void => {
        if (!this.running) return;

        this.monitoring.begin();

        const currentTime = performance.now();
        this.delta = Math.min(currentTime - this.current, 100); // Clamping to prevent large jumps
        this.current = currentTime;
        this.elapsed = this.current - this.start;

        this.trigger("tick");

        this.monitoring.end();

        requestAnimationFrame(this.tick);
    };

}