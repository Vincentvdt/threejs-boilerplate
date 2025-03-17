import Stats from "three/addons/libs/stats.module.js"

export default class Monitoring {
    constructor() {
        this.panels = []

        this.fpsPanel = new Stats()
        this.fpsPanel.showPanel(0)
        this.fpsPanel.domElement.style.cssText = "position:absolute;top:0px;left:0px;"
        this.panels.push(this.fpsPanel)

        this.msPanel = new Stats()
        this.msPanel.showPanel(1)
        this.msPanel.domElement.style.cssText = "position:absolute;top:0px;left:80px;"
        this.panels.push(this.msPanel)
        
        this.addPanels()
    }

    addPanels() {
        this.panels.forEach(panel => {
            document.body.appendChild(panel.domElement)
        })
    }

    begin() {
        this.panels.forEach(panel => panel.begin())
    }

    end() {
        this.panels.forEach(panel => panel.end())
    }

}