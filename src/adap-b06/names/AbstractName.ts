import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export abstract class AbstractName implements Name {
    
    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(delimiter !== null && delimiter !== undefined, "Delimiter cannot be null");
        IllegalArgumentException.assert(delimiter.length === 1, "Delimiter must be exactly one character");
        this.delimiter = delimiter;
    }

    protected abstract getComponentArray(): string[];
    protected abstract createFromComponents(components: string[]): Name;
    public abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(delimiter !== null && delimiter !== undefined && delimiter.length === 1, "Delimiter must be one character");
        if (this.isEmpty()) return "";
        return this.getComponentArray().join(delimiter);
    }

    public asDataString(): string {
        return this.asString(DEFAULT_DELIMITER);  // Benutze DEFAULT_DELIMITER
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    // Equality Implementation
    public isEqual(other: Object): boolean {
        if (!(other instanceof AbstractName)) return false;
        if (this.getNoComponents() !== other.getNoComponents()) return false;
        
        for (let i = 0; i < this.getNoComponents(); i++) {  // Alle Komponenten vergleichen
            if (this.getComponent(i) !== other.getComponent(i)) return false;
        }
        return true;
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        
        for (let i: number = 0; i < s.length; i++) {  // Standard Hash-Berechnung
            let c: number = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    // Interface Implementation
    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getNoComponents(): number {
        return this.getComponentArray().length;
    }

    public getComponent(i: number): string {
        this.assertValidIndex(i);  // Precondition check
        return this.getComponentArray()[i];
    }

    // Immutable - geben alle neue Objekte zurück
    public setComponent(i: number, c: string): Name {
        this.assertValidIndex(i);
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component cannot be null");
        
        const oldCount = this.getNoComponents();
        const components = [...this.getComponentArray()];  // Kopieren
        components[i] = c;
        const result = this.createFromComponents(components);
        
        MethodFailedException.assert(result.getNoComponents() === oldCount, "Component count must not change");  
        return result;
    }

    public insert(i: number, c: string): Name {
        IllegalArgumentException.assert(i >= 0 && i <= this.getNoComponents(), `Invalid index for insert: ${i}`);
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component cannot be null");
        
        const oldCount = this.getNoComponents();
        const components = [...this.getComponentArray()];
        components.splice(i, 0, c);  // An Position i einfügen
        const result = this.createFromComponents(components);
        
        MethodFailedException.assert(result.getNoComponents() === oldCount + 1, "Component count must increase by 1");
        return result;
    }

    public append(c: string): Name {
        return this.insert(this.getNoComponents(), c);  // Insert am Ende
    }

    public remove(i: number): Name {
        this.assertValidIndex(i);
        
        const oldCount = this.getNoComponents();
        const components = [...this.getComponentArray()];
        components.splice(i, 1);  // An Position i entfernen
        const result = this.createFromComponents(components);
        
        MethodFailedException.assert(result.getNoComponents() === oldCount - 1, "Component count must decrease by 1");
        return result;
    }

    public concat(other: Name): Name {
        IllegalArgumentException.assert(other !== null && other !== undefined, "Cannot concat with null");
        
        const components = [...this.getComponentArray()];
        for (let i = 0; i < other.getNoComponents(); i++) {  // Alle Komponenten von other hinzufügen
            components.push(other.getComponent(i));
        }
        return this.createFromComponents(components);
    }

    protected assertValidIndex(i: number): void {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), `Index out of bounds: ${i}`);
    }
}