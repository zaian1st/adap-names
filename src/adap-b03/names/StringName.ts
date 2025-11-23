import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);
        this.name = source ?? "";
        //  Komponenten initial zählen
        this.updateNoComponents();
    }

    public clone(): Name {
        const copy = new StringName(this.name, this.delimiter);
        return copy;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        const parts = this.split();
        if (i < 0 || i >= parts.length) {
            throw new Error("Index out of bounds");
        }
        return parts[i];
    }

    public setComponent(i: number, c: string): void {
        const parts = this.split();
        if (i < 0 || i >= parts.length) {
            throw new Error("Index out of bounds");
        }
        parts[i] = c;
        this.join(parts);
    }

    public insert(i: number, c: string): void {
        const parts = this.split();
        if (i < 0 || i > parts.length) {
            throw new Error("Index out of bounds");
        }
        parts.splice(i, 0, c);
        this.join(parts);
    }

    public append(c: string): void {
        const parts = this.split();
        parts.push(c);
        this.join(parts);
    }

    public remove(i: number): void {
        const parts = this.split();
        if (i < 0 || i >= parts.length) {
            throw new Error("Index out of bounds");
        }
        parts.splice(i, 1);
        this.join(parts);
    }

    // Internen String in Array zerlegen
    private split(): string[] {
        if (this.name === "") {
            return [];
        }
        return this.name.split(this.delimiter);
    }

    // String umwandeln
    private join(parts: string[]): void {
        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;
    }

    //  Komponentenanzahl neu berechnen
    private updateNoComponents(): void {
        if (this.name === "") {
            this.noComponents = 0;
        } else {
            this.noComponents = this.name.split(this.delimiter).length;
        }
    }

}