import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {
    
    protected name: string = "";

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    protected getComponentArray(): string[] {
        if (this.name === "") return [];
        
        const components: string[] = [];
        let current = "";
        let escaped = false;
        
        for (let i = 0; i < this.name.length; i++) {  // String parsen mit Escape-Handling
            const char = this.name[i];
            
            if (escaped) {
                current += char;  // Nach Escape-Zeichen: übernehmen
                escaped = false;
            } else if (char === ESCAPE_CHARACTER) {
                escaped = true;  // Escape aktivieren
            } else if (char === this.delimiter) {
                components.push(current);  // Delimiter gefunden
                current = "";
            } else {
                current += char;
            }
        }
        
        components.push(current);  // Letzte Komponente
        return components;
    }

    protected createFromComponents(components: string[]): Name {
        const escaped = components.map(comp => this.escapeComponent(comp));  // Alle Komponenten escapen
        const newName = escaped.join(this.delimiter);
        return new StringName(newName, this.delimiter);
    }

    private escapeComponent(comp: string): string {
        let result = "";
        for (const char of comp) {
            if (char === ESCAPE_CHARACTER || char === this.delimiter) {  // Sonderzeichen escapen
                result += ESCAPE_CHARACTER;
            }
            result += char;
        }
        return result;
    }
}