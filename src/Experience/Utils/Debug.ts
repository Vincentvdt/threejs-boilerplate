import { GUI } from "lil-gui";
import Manageable from "@/Experience/Utils/Manageable.ts";

export default class Debug implements Manageable {
    public ui!: GUI;

    constructor() {
        if (this.isActive) {
            this.ui = new GUI();
        }
    }

    public get isActive(): boolean {
        return window.location.hash === "#debug";
    }

    public destroy(): void {
        this.ui.destroy();
    }
}