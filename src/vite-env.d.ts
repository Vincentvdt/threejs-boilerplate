/// <reference types="vite/client" />

import Experience from "./Experience/Experience.ts";

declare global {
    interface Window {
        experience: Experience | null;
    }
}