import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    // Zerlegt einen String in seine Einzelteile
    private parseSource(source: string, delim: string): string[] {
        const esc = ESCAPE_CHARACTER;
        const parts: string[] = [];
        let buf = "";
        let escaped = false;
        
        for (const ch of source) {
            if (escaped) {
                buf += ch;
                escaped = false;
            } else if (ch === esc) {
                escaped = true;
            } else if (ch === delim) {
                parts.push(buf);
                buf = "";
            } else {
                buf += ch;
            }
        }
        parts.push(buf);
        return parts;
    }

    // Prüft ob der Delimiter genau ein Zeichen lang ist
    private ensureSingleCharDelimiter(d?: string): string {
        if (d === undefined || d === null) return this.delimiter;
        if (d.length !== 1) {
            throw new Error("Delimiter must be a single character");
        }
        return d;
    }

    // Fügt Escape-Zeichen vor Sonderzeichen ein für den Standard-Delimiter
    private escapeForDataString(component: string): string {
        const esc = ESCAPE_CHARACTER;
        const defDelim = DEFAULT_DELIMITER;
        let out = "";
        for (const ch of component) {
            if (ch === esc || ch === defDelim) {
                out += esc;
            }
            out += ch;
        }
        return out;
    }

    // Maskiert Komponente mit dem aktuellen Delimiter
    private maskComponent(component: string, delim: string): string {
        const esc = ESCAPE_CHARACTER;
        let out = "";
        for (const ch of component) {
            if (ch === esc || ch === delim) {
                out += esc;
            }
            out += ch;
        }
        return out;
    }

    // Baut den internen String aus den Komponenten wieder auf
    private rebuildFromComponents(components: string[]): void {
        const masked = components.map(c => this.maskComponent(c, this.delimiter));
        this.name = masked.join(this.delimiter);
        this.noComponents = components.length;
    }

    constructor(source: string, delimiter?: string) {
        if (delimiter !== undefined) {
            if (delimiter.length !== 1) {
                throw new Error("Delimiter must be a single character");
            }
            this.delimiter = delimiter;
        }
        // Speichert den String direkt ohne ihn zu verändern
        this.name = source;
        const parsed = this.parseSource(source, this.delimiter);
        this.noComponents = parsed.length;
    }

    public asString(delimiter: string = this.delimiter): string {
        const d = this.ensureSingleCharDelimiter(delimiter);
        // Wenn gleicher Delimiter dann einfach zurückgeben
        if (d === this.delimiter) {
            return this.name;
        }
        // Sonst erst parsen und mit neuem Delimiter verbinden
        const components = this.parseSource(this.name, this.delimiter);
        return components.join(d);
    }

    public asDataString(): string {
        // Parst die Komponenten und escaped sie für den Standard-Delimiter
        const components = this.parseSource(this.name, this.delimiter);
        const escaped = components.map(c => this.escapeForDataString(c));
        return escaped.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.noComponents) {
            throw new RangeError("Index out of bounds");
        }
        // Muss jedes Mal parsen um an Komponenten zu kommen
        const components = this.parseSource(this.name, this.delimiter);
        return components[i];
    }

    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.noComponents) {
            throw new RangeError("Index out of bounds");
        }
        // Parsen, ändern, dann wieder zusammenbauen
        const components = this.parseSource(this.name, this.delimiter);
        components[i] = c;
        this.rebuildFromComponents(components);
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.noComponents) {
            throw new RangeError("Index out of bounds");
        }
        const components = this.parseSource(this.name, this.delimiter);
        components.splice(i, 0, c);
        this.rebuildFromComponents(components);
    }

    public append(c: string): void {
        const components = this.parseSource(this.name, this.delimiter);
        components.push(c);
        this.rebuildFromComponents(components);
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.noComponents) {
            throw new RangeError("Index out of bounds");
        }
        const components = this.parseSource(this.name, this.delimiter);
        components.splice(i, 1);
        this.rebuildFromComponents(components);
    }

    public concat(other: Name): void {
        // Holt andere Name als DataString damit Escaping erhalten bleibt
        const otherData = other.asDataString();
        const otherComps = this.parseSource(otherData, DEFAULT_DELIMITER);
        const thisComps = this.parseSource(this.name, this.delimiter);
        thisComps.push(...otherComps);
        this.rebuildFromComponents(thisComps);
    }

}