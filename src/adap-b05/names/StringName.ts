import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;
        this.noComponents = this.countComponents();
    }

    // komponenten zählen
    private countComponents(): number {
        if (this.name.length === 0) {
            return 0;
        }
        let count = 1;
        let escaped = false;
        for (let i = 0; i < this.name.length; i++) {
            if (escaped) {
                escaped = false;
            } else if (this.name[i] === ESCAPE_CHARACTER) {
                escaped = true;
            } else if (this.name[i] === this.delimiter) {
                count++;
            }
        }
        return count;
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents);
        const parts = this.split();
        return parts[i];
    }

    // string in komponenten aufteilen
    private split(): string[] {
        const result: string[] = [];
        let current = "";
        let escaped = false;
        
        for (let i = 0; i < this.name.length; i++) {
            const ch = this.name[i];
            if (escaped) {
                current += ch;
                escaped = false;
            } else if (ch === ESCAPE_CHARACTER) {
                escaped = true;
            } else if (ch === this.delimiter) {
                result.push(current);
                current = "";
            } else {
                current += ch;
            }
        }
        result.push(current);
        return result;
    }

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents);
        const parts = this.split();
        parts[i] = this.escape(c);
        this.name = parts.join(this.delimiter);
    }

    // escape character hinzufügen
    private escape(comp: string): string {
        let result = "";
        for (let j = 0; j < comp.length; j++) {
            const ch = comp[j];
            if (ch === this.delimiter || ch === ESCAPE_CHARACTER) {
                result += ESCAPE_CHARACTER;
            }
            result += ch;
        }
        return result;
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assert(i >= 0 && i <= this.noComponents);
        const parts = this.split();
        parts.splice(i, 0, this.escape(c));
        this.name = parts.join(this.delimiter);
        this.noComponents++;
    }

    public append(c: string) {
        const escaped = this.escape(c);
        if (this.noComponents === 0) {
            this.name = escaped;
        } else {
            this.name = this.name + this.delimiter + escaped;
        }
        this.noComponents++;
    }

    public remove(i: number) {
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents);
        const parts = this.split();
        parts.splice(i, 1);
        this.name = parts.join(this.delimiter);
        this.noComponents--;
    }

}