type Callback = (...args: any[]) => void;

interface EventCallbacks {
    [event: string]: Callback[];
}

interface NamespaceCallbacks {
    [namespace: string]: EventCallbacks;
}

export default class EventEmitter {
    static instance: EventEmitter | null = null;
    private callbacks: NamespaceCallbacks = { base: {} };

    constructor() {
        // Initialize base namespace to avoid undefined errors.
        this.callbacks.base = {};
    }

    static getInstance(): EventEmitter {
        if (!this.instance) {
            this.instance = new EventEmitter();
        }
        return this.instance;
    }

    // on method to add event listeners
    on(_names: string, callback: Callback): boolean | this {
        // Validate input
        if (typeof _names === "undefined" || _names === "") {
            console.warn("wrong names");
            return false;
        }

        if (typeof callback !== "function") {
            console.warn("wrong callback");
            return false;
        }

        // Resolve event names
        const names = this.resolveNames(_names);

        // Add callback to the events
        names.forEach((_name) => {
            const name = this.resolveName(_name);

            // Create namespace if not exists
            if (!(this.callbacks[name.namespace] instanceof Object)) {
                this.callbacks[name.namespace] = {};
            }

            // Create event array if not exists
            if (!(this.callbacks[name.namespace][name.value] instanceof Array)) {
                this.callbacks[name.namespace][name.value] = [];
            }

            // Add callback to the event
            this.callbacks[name.namespace][name.value].push(callback);
        });

        return this;
    }

    // off method to remove event listeners
    off(_names: string, callback: Callback | null = null): boolean | this {
        if (typeof _names === "undefined" || _names === "") {
            console.warn("wrong name");
            return false;
        }

        const names = this.resolveNames(_names);

        names.forEach((_name) => {
            const name = this.resolveName(_name);

            if (name.namespace !== "base" && name.value === "") {
                delete this.callbacks[name.namespace];
            } else {
                if (name.namespace === "base") {
                    for (const namespace in this.callbacks) {
                        if (this.callbacks[namespace] instanceof Object &&
                            this.callbacks[namespace][name.value] instanceof Array) {

                            if (callback) {
                                this.callbacks[namespace][name.value] = this.callbacks[namespace][name.value].filter(fn => fn !== callback);
                            } else {
                                delete this.callbacks[namespace][name.value];
                            }

                            if (Object.keys(this.callbacks[namespace]).length === 0) {
                                delete this.callbacks[namespace];
                            }
                        }
                    }
                } else if (this.callbacks[name.namespace] instanceof Object &&
                    this.callbacks[name.namespace][name.value] instanceof Array) {

                    if (callback) {
                        this.callbacks[name.namespace][name.value] = this.callbacks[name.namespace][name.value].filter(fn => fn !== callback);
                    } else {
                        delete this.callbacks[name.namespace][name.value];
                    }

                    if (Object.keys(this.callbacks[name.namespace]).length === 0) {
                        delete this.callbacks[name.namespace];
                    }
                }
            }
        });

        return this;
    }

    // trigger method to execute event callbacks
    trigger(_name: string, _args?: any[]): void {
        if (typeof _name === "undefined" || _name === "") {
            console.warn("wrong name");
            return;
        }

        // Resolve event names (should only have one event)
        const names = this.resolveNames(_name);
        const name = this.resolveName(names[0]);

        const args = !_args ? [] : _args;

        // Default namespace is "base"
        if (name.namespace === "base") {
            // Try to find callbacks in each namespace
            for (const namespace in this.callbacks) {
                if (this.callbacks[namespace] instanceof Object &&
                    this.callbacks[namespace][name.value] instanceof Array) {

                    this.callbacks[namespace][name.value].forEach((callback) => {
                        callback.apply(this, args);
                    });
                }
            }
        } else if (this.callbacks[name.namespace] instanceof Object) {
            if (name.value === "") {
                console.warn("wrong name");
                return;
            }

            this.callbacks[name.namespace][name.value].forEach((callback) => {
                callback.apply(this, args);
            });
        }
    }

    // Helper method to resolve event names into an array
    resolveNames(_names: string): string[] {
        let names = _names.replace(/[^a-zA-Z0-9 ,/.]/g, ""); // Remove special chars
        names = names.replace(/[,/]+/g, " "); // Replace commas and slashes with spaces
        return names.split(" ");
    }

    // Helper method to resolve a name into an object with namespace and value
    resolveName(name: string): { original: string, value: string, namespace: string } {
        const newName = { original: name, value: "", namespace: "base" };
        const parts = name.split(".");

        newName.value = parts[0];

        if (parts.length > 1 && parts[1] !== "") {
            newName.namespace = parts[1];
        }

        return newName;
    }
}