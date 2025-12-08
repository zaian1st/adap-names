import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {           // state muss CLOSED sein
        InvalidStateException.assert(this.state === FileState.CLOSED, "file must be closed");
        this.state = FileState.OPEN;
    }

    public read(noBytes: number): Int8Array {
        IllegalArgumentException.assert(noBytes >= 0, "noBytes cannot be negative");
        InvalidStateException.assert(this.state === FileState.OPEN, "file must be open");
        
        let result: Int8Array = new Int8Array(noBytes);

        let tries: number = 0;
        for (let i: number = 0; i < noBytes; i++) {
            try {
                result[i] = this.readNextByte();
            } catch(ex) {
                tries++;
                if (ex instanceof MethodFailedException) {      // escalate zu service failure
                    throw new ServiceFailureException("read failed after " + tries + " tries", ex);
                }
            }
        }

        return result;
    }

    protected readNextByte(): number {
        return 0; // @todo
    }

    public close(): void {
        InvalidStateException.assert(this.state === FileState.OPEN, "file must be open");
        this.state = FileState.CLOSED;
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}