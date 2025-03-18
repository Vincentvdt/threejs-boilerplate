import Experience from "@/Experience/Experience.ts";

const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement | null;

if (!canvas) {
    console.warn("Canvas element not found.");
} else {
    Experience.getInstance(canvas);
}


