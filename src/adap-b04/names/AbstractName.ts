import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {    // Delimiter muss genau ein Zeichen sein
        if (delimiter.length != 1) {
            throw new IllegalArgumentException("Delimiter muss ein einzelnes Zeichen sein");
        }
        this.delimiter = delimiter;
    }

    public abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {   // Prüfe Delimiter
        if (delimiter.length != 1) {
            throw new IllegalArgumentException("Delimiter muss ein einzelnes Zeichen sein");
        }

        // Baue String aus Komponenten zusammen
        let result = "";
        const n = this.getNoComponents();
        
        for (let i = 0; i < n; i++) {
            if (i > 0) {
                result += delimiter;
            }
            result += this.getComponent(i);
        }
        
        return result;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {     // Verwende asString mit dem eigenen Delimiter
        return this.asString(this.delimiter);
    }

    public isEqual(other: Name): boolean {
        // Prüfe auf null
        if (other == null || other == undefined) {
            throw new IllegalArgumentException("other darf nicht null sein");
        }

        // Vergleiche über DataString
        return this.asDataString() == other.asDataString();
    }

    public getHashCode(): number {          // Einfacher Hashcode
        let hash = 0;
        const str = this.asDataString();
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash | 0;
        }
        
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() == 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {              // Prüfe auf null
        if (other == null || other == undefined) {
            throw new IllegalArgumentException("other darf nicht null sein");
        }

        // Merke alte Anzahl
        const oldCount = this.getNoComponents();
        const addCount = other.getNoComponents();

        // Füge alle Komponenten hinzu
        for (let i = 0; i < addCount; i++) {
            this.append(other.getComponent(i));
        }

        // Prüfe ob alle hinzugefügt wurden
        const newCount = this.getNoComponents();
        if (newCount != oldCount + addCount) {
            throw new MethodFailedException("concat hat nicht funktioniert");
        }
    }

}