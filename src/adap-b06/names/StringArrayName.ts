import { DEFAULT_DELIMITER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {
    
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        this.components = [...source];  // Array kopieren
    }

    public clone(): Name {
        return new StringArrayName([...this.components], this.delimiter);
    }

    protected getComponentArray(): string[] {
        return [...this.components];  // Kopie für Immutability
    }

    protected createFromComponents(components: string[]): Name {
        return new StringArrayName([...components], this.delimiter);
    }
}