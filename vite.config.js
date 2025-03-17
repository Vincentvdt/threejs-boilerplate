import glsl from "vite-plugin-glsl"

export default {
    plugins: [glsl()],
    build: {
        sourcemap: false,
    },
}

