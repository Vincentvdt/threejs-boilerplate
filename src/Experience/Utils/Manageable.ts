export default interface Manageable {
    destroy(): void;

    update?(): void;

    resize?(): void;

    enableEvents?(): void;

    disableEvents?(): void;

}
