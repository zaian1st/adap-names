import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {
        // komponenten mit delimiter zusammenfügen
        let result = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
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

    public asDataString(): string {
        return this.asString(this.delimiter);
    }

    public isEqual(other: Name): boolean {
        if (this.getNoComponents() != other.getNoComponents()) {         // anzahl prüfen
            return false;
        }
        for (let i = 0; i < this.getNoComponents(); i++) {               // komponenten durchgehen
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return true;
    }

    public getHashCode(): number {
        let hash = 0;
        const str = this.asDataString();
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
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

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}