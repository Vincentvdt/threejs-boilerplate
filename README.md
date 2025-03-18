# Three.js Boilerplate

This is a lightweight and modular Three.js boilerplate built with Vite for fast development. It includes essential
utilities, a structured scene setup, and debugging tools to help streamline your Three.js projects.

## Features

- **Three.js Setup:** Preconfigured scene, camera, renderer, and world management.
- **Vite Integration:** Fast development server and optimized build process.

- **Utilities:**

    - Debugging with `lil-gui` and `stats.js` for performance monitoring
    - Mouse interaction and event management
    - Raycasting system
    - Post-processing effects

- **Shaders Support:** Uses `vite-plugin-glsl` to easily import GLSL shaders.
- **Singleton Experience Manager:** Ensures a single instance of the experience to maintain global state.
- **Shape Class:** A flexible class for creating and managing 3D shapes with configurable properties, shader support,
  and event listening.

## Folder Structure

````
threejs-boilerplate/
│-- public/                     # Static assets
│-- src/
│   │-- Experience/              # Core experience setup
│   │   │-- shaders/             # GLSL shaders
│   │   │-- Utils/               # Utility classes (debug, events, sizes, etc.)
│   │   │-- World/               # 3D world elements
│   │   │-- Camera.js            # Camera setup
│   │   │-- Renderer.js          # Renderer setup
│   │   │-- Experience.js        # Main experience class
│   │   │-- Shape.js             # 3D Shape class
│   │-- main.js                  # Entry point
│-- index.html                   # HTML template
│-- style.css                     # Global styles
│-- vite.config.js                # Vite configuration
│-- package.json                  # Dependencies and scripts
````

## Installation & Usage

1. Install dependencies

``npm install``

2. Start development server

``npm run dev``.

## Dependencies

`three` – 3D library

`vite` – Fast bundler

`lil-gui` – Debugging UI

`stats.js` – Performance monitoring

`vite-plugin-glsl` – GLSL shader support

## Future Improvements

- Add asset management system
- Implement physics engine integration
- Extend UI controls and interactivity

## License

MIT

