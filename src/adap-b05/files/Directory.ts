import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    public findNodes(bn: string): Set<Node> {       // erst eigenen namen checken dann durch alle children gehen
        const result = super.findNodes(bn);
        for (let child of this.childNodes) {
            const childMatches = child.findNodes(bn);
            childMatches.forEach(node => result.add(node));
        }
        return result;
    }

}