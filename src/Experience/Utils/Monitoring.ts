import Stats from "three/examples/jsm/libs/stats.module.js";

export default class Monitoring {
    private panels: Stats[] = [];

    constructor(enabledPanels: number[] = [ 0, 1 ]) {
        this.initializePanels(enabledPanels);
        this.addPanels();
    }

    private get isActive(): boolean {
        return window.location.hash === "#debug";
    }


    public begin(): void {
        if (this.isActive) {
            this.panels.forEach(panel => panel.begin());
        }
    }

    public end(): void {
        if (this.isActive) {
            this.panels.forEach(panel => panel.end());
        }
    }

    private addPanels(): void {
        if (!this.isActive) return;

        const fragment = document.createDocumentFragment();
        this.panels.forEach(panel => fragment.appendChild(panel.dom));
        document.body.appendChild(fragment);
    }

    private initializePanels(panelIndices: number[]): void {
        if (!this.isActive) return;

        panelIndices.forEach((index, i) => {
            const panel = new Stats();
            panel.showPanel(index);
            panel.dom.style.cssText = `position:absolute;top:0px;left:${ i * 80 }px;`;
            this.panels.push(panel);
        });
    }
}
