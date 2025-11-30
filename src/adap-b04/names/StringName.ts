import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        
        // Prüfe ob source null ist
        if (source == null || source == undefined) {
            throw new IllegalArgumentException("source darf nicht null sein");
        }
        
        this.name = source;
        this.noComponents = this.calculateComponents();
    }

    private calculateComponents(): number {
        if (this.name == "") {
            return 0;
        }
        
        let count = 1;
        for (let i = 0; i < this.name.length; i++) {
            // Zähle nicht-escaped delimiters
            if (this.name[i] == this.delimiter) {
                if (i == 0 || this.name[i-1] != ESCAPE_CHARACTER) {
                    count++;
                }
            }
        }
        
        return count;
    }

    // Finde Start-Index von Komponente i
    private findStartIndex(i: number): number {
        if (i == 0) {
            return 0;
        }
        
        let comp = 0;
        for (let idx = 0; idx < this.name.length; idx++) {
            if (this.name[idx] == this.delimiter) {
                if (idx == 0 || this.name[idx-1] != ESCAPE_CHARACTER) {
                    comp++;
                    if (comp == i) {
                        return idx + 1;
                    }
                }
            }
        }
        
        return this.name.length;
    }

    // End-Index von Komponente i
    private findEndIndex(i: number): number {
        let comp = 0;
        let idx = 0;
        
        //  Komponente i
        while (idx < this.name.length && comp < i) {
            if (this.name[idx] == this.delimiter) {
                if (idx == 0 || this.name[idx-1] != ESCAPE_CHARACTER) {
                    comp++;
                }
            }
            idx++;
        }
        
        // Ende
        while (idx < this.name.length) {
            if (this.name[idx] == this.delimiter) {
                if (idx == 0 || this.name[idx-1] != ESCAPE_CHARACTER) {
                    return idx;
                }
            }
            idx++;
        }
        
        return this.name.length;
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        // Prüfe Index
        if (i < 0 || i >= this.noComponents) {
            throw new IllegalArgumentException("Index außerhalb des Bereichs");
        }
        
        const start = this.findStartIndex(i);
        const end = this.findEndIndex(i);
        
        return this.name.substring(start, end);
    }

    public setComponent(i: number, c: string): void {
        // Prüfe Index
        if (i < 0 || i >= this.noComponents) {
            throw new IllegalArgumentException("Index außerhalb des Bereichs");
        }
        
        if (c == null || c == undefined) {
            throw new IllegalArgumentException("component darf nicht null sein");
        }

        const start = this.findStartIndex(i);
        const end = this.findEndIndex(i);
        
        this.name = this.name.substring(0, start) + c + this.name.substring(end);
        
        if (this.getComponent(i) != c) {
            throw new MethodFailedException("setComponent hat nicht funktioniert");
        }
    }

    public insert(i: number, c: string): void {
        // Prüfe Index
        if (i < 0 || i > this.noComponents) {
            throw new IllegalArgumentException("Index außerhalb des Bereichs");
        }
        
        if (c == null || c == undefined) {
            throw new IllegalArgumentException("component darf nicht null sein");
        }

        const oldCount = this.noComponents;
        
        // Füge ein
        if (i == 0) {
            // Am Anfang
            if (this.name == "") {
                this.name = c;
            } else {
                this.name = c + this.delimiter + this.name;
            }
        } else if (i == this.noComponents) {
            // Am Ende
            if (this.name == "") {
                this.name = c;
            } else {
                this.name = this.name + this.delimiter + c;
            }
        } else {
            const pos = this.findStartIndex(i);
            this.name = this.name.substring(0, pos) + c + this.delimiter + this.name.substring(pos);
        }
        
        // Update Anzahl
        this.noComponents = this.calculateComponents();
        
        if (this.noComponents != oldCount + 1) {
            throw new MethodFailedException("insert hat nicht funktioniert");
        }
    }

    public append(c: string): void {
        if (c == null || c == undefined) {
            throw new IllegalArgumentException("component darf nicht null sein");
        }

        const oldCount = this.noComponents;
        if (this.name == "") {
            this.name = c;
        } else {
            this.name = this.name + this.delimiter + c;
        }
        this.noComponents = this.calculateComponents();
        if (this.noComponents != oldCount + 1) {
            throw new MethodFailedException("append hat nicht funktioniert");
        }
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.noComponents) {
            throw new IllegalArgumentException("Index außerhalb des Bereichs");
        }
        const oldCount = this.noComponents;
        const start = this.findStartIndex(i);
        const end = this.findEndIndex(i);
        if (i == 0 && this.noComponents == 1) {
            this.name = "";
        } else if (i == 0) {
            // Erste Komponente
            this.name = this.name.substring(end + 1);
        } else if (i == this.noComponents - 1) {
            // Letzte Komponente
            this.name = this.name.substring(0, start - 1);
        } else {
            // Mittlere Komponente
            this.name = this.name.substring(0, start) + this.name.substring(end + 1);
        }
        
        // Update Anzahl
        this.noComponents = this.calculateComponents();
        
        if (this.noComponents != oldCount - 1) {
            throw new MethodFailedException("remove hat nicht funktioniert");
        }
    }
}