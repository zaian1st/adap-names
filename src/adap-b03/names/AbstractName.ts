import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        // Delimiter muss genau ein Zeichen sein
        if (!delimiter || delimiter.length !== 1) {
            throw new Error("Delimiter must be exactly one character");
        }
        this.delimiter = delimiter;
    }

    public abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {
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

    public asDataString(): string {
        //  Maschinen-lesbar mit Maskierung
        let result = "";
        const n = this.getNoComponents();
        for (let i = 0; i < n; i++) {
            if (i > 0) {
                result += DEFAULT_DELIMITER;
            }
            // Sonderzeichen in Komponente maskieren
            const component = this.getComponent(i);
            result += this.maskString(component, DEFAULT_DELIMITER);
        }
        return result;
    }

    public isEqual(other: Name): boolean {
        //  Vergleich über Datenstring
        if (!other) return false;
        return this.asDataString() === other.asDataString();
    }

    public getHashCode(): number {
        //  Einfacher Hash basierend auf Datenstring
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            const c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0; // Auf 32-Bit begrenzen
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        const n = this.getNoComponents();
        if (n === 0) return true;
        if (n === 1 && this.getComponent(0) === "") return true;
        return false;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    //  Abstrakte Methoden für Unterklassen
    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        // Alle Komponenten von other anhängen
        const n = other.getNoComponents();
        for (let i = 0; i < n; i++) {
            this.append(other.getComponent(i));
        }
    }

    //  Hilfsmethode: Sonderzeichen maskieren
    protected maskString(str: string, delimiter: string): string {
        let result = "";
        for (let i = 0; i < str.length; i++) {
            const c = str[i];
            //  ESCAPE_CHARACTER und Delimiter escapen
            if (c === ESCAPE_CHARACTER || c === delimiter) {
                result += ESCAPE_CHARACTER;
            }
            result += c;
        }
        return result;
    }

    //  Hilfsmethode: maskierten String parsen
    protected static unmaskString(source: string, delimiter: string): string[] {
        const components: string[] = [];
        let current = "";
        let escaped = false;

        for (let i = 0; i < source.length; i++) {
            const c = source[i];
            
            if (escaped) {
                current += c;
                escaped = false;
            } else if (c === ESCAPE_CHARACTER) {
                escaped = true;
            } else if (c === delimiter) {
                components.push(current);
                current = "";
            } else {
                current += c;
            }
        }
        components.push(current);
        return components;
    }

}