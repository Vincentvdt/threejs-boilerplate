import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import path from "path";


export default defineConfig({
    plugins: [ glsl() ],
    resolve: {
        alias: {
            "@": path.resolve("./src"),
        },
    },
});