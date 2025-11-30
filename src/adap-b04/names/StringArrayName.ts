import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        
        // Prüfe ob source null ist
        if (source == null || source == undefined) {
            throw new IllegalArgumentException("source darf nicht null sein");
        }
        this.components = [...source];
    }

    public clone(): Name {
        // Erstelle neue Instanz mit kopierten Komponenten
        return new StringArrayName([...this.components], this.delimiter);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) {
            throw new IllegalArgumentException("Index außerhalb des Bereichs");
        }
        
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.components.length) {
            throw new IllegalArgumentException("Index außerhalb des Bereichs");
        }
        
        // Prüfe ob c null ist
        if (c == null || c == undefined) {
            throw new IllegalArgumentException("component darf nicht null sein");
        }

        this.components[i] = c;
        if (this.components[i] != c) {
            throw new MethodFailedException("setComponent hat nicht funktioniert");
        }
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new IllegalArgumentException("Index außerhalb des Bereichs");
        }
        
        if (c == null || c == undefined) {
            throw new IllegalArgumentException("component darf nicht null sein");
        }

        const oldLength = this.components.length;

        this.components.splice(i, 0, c);
        
        if (this.components.length != oldLength + 1) {
            throw new MethodFailedException("Länge nicht richtig erhöht");
        }
        
        if (this.components[i] != c) {
            throw new MethodFailedException("Komponente nicht richtig eingefügt");
        }
    }

    public append(c: string): void {
        // Prüfe ob c null ist
        if (c == null || c == undefined) {
            throw new IllegalArgumentException("component darf nicht null sein");
        }

        const oldLength = this.components.length;
        this.components.push(c);
        if (this.components.length != oldLength + 1) {
            throw new MethodFailedException("append hat nicht funktioniert");
        }
    }

    public remove(i: number): void {
        // Prüfe Index
        if (i < 0 || i >= this.components.length) {
            throw new IllegalArgumentException("Index außerhalb des Bereichs");
        }
        const oldLength = this.components.length;
        this.components.splice(i, 1);
        if (this.components.length != oldLength - 1) {
            throw new MethodFailedException("remove hat nicht funktioniert");
        }
    }
}