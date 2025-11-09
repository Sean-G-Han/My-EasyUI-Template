import { SignalObject } from "./signal";

class RefRegistryNode {
    className: string = ""; 
    id: number = 0;
    ref?: any;// temp placeholder before I find out what type ref is
    parents?: RefRegistryNode[] = [];
    children?: RefRegistryNode[] = [];
    constructor(className: string, id: number) {
        this.className = className;
        this.id = id;
    }

    static addRelation(parent: RefRegistryNode, child: RefRegistryNode) {
        parent.children = parent.children || [];
        child.parents = child.parents || [];
        parent.children.push(child);
        child.parents.push(parent);
    }

    static removeRelation(parent: RefRegistryNode, child: RefRegistryNode) {
        if (parent.children) {
            parent.children = parent.children.filter((c) => c !== child);
        }
        if (child.parents) {
            child.parents = child.parents.filter((p) => p !== parent);
        }
    }

    static addReference(node: RefRegistryNode, ref: any) {
        node.ref = ref;
    }

    static removeReference(node: RefRegistryNode) {
        node.ref = undefined;
    }

    static hasReference(node: RefRegistryNode): boolean {   
        return node.ref !== undefined;
    }

    treeString(level: number = 0, isLast: boolean = true, prefix: string = ""): string {
        const RESET = "\x1b[0m";
        const DIM = "\x1b[90m";
        const CYAN = "\x1b[36m";
        const YELLOW = "\x1b[33m";
        const RED = "\x1b[31m";
        const GREEN = "\x1b[32m";

        let result = "";

        const branch = level === 0 ? "" : (isLast ? `${DIM}└── ${RESET}` : `${DIM}├── ${RESET}`);
        const classPart = `${CYAN}${this.className}${RESET}`;
        const idPart = `${YELLOW}${this.id}${RESET}`;
        const noRef = this.ref ? `${GREEN}(Referenced)${RESET}` : `${RED}(No Reference)${RESET}`;

        result += prefix + branch + `${classPart} (id: ${idPart}) ${noRef}\n`;

        if (this.children && this.children.length > 0) {
            const newPrefix = prefix + (level === 0 ? "" : (isLast ? `${DIM}    ${RESET}` : `${DIM}│   ${RESET}`));
            const lastIndex = this.children.length - 1;

            this.children.forEach((child, i) => {
                const last = i === lastIndex;
                result += child.treeString(level + 1, last, newPrefix);
            });
        }

        return result;
    }
}

export class RefRegistry {
    private static registry: Map<string, Array<RefRegistryNode>> = new Map();
    private static allRefs: Set<any> = new Set();

    static clear() {
        //console.log("Clearing RefRegistry");
        this.registry.clear();
        this.allRefs.clear();
    }

    // dear future self, please dont confuse registerRef with addReference or Ref with Reference
    // registerRef creates a new RefRegistryNode and adds it to the registry
    static registerRef(className: string, id: number): RefRegistryNode {
        const node = new RefRegistryNode(className, id);
        const existingNodes = this.registry.get(className) || [];
        existingNodes[id] = node; // dont use push() in case id != pos (e.g. if skipped)
        this.registry.set(className, existingNodes);
        return node;
    }

    static deleteRef(className: string, id: number) {
        const nodes = this.registry.get(className);
        if (nodes && nodes.length > id) {
            nodes.splice(id, 1);
        }
    }

    static getNumberOfClass(className: string): number {
        const nodes = this.registry.get(className);
        return nodes ? nodes.length : 0;
    }

    static treeString(nodeName: string, id: number = 0, level: number = 0): string {
        const nodes = this.registry.get(nodeName);
        if (!nodes || nodes.length <= id) {
            return "";
        }

        return nodes[id].treeString(level);
    }

    static treeStringAll(): string {
        let parentlessNodes: RefRegistryNode[] = [];
        this.registry.forEach((nodes) => {
            nodes.forEach((node) => {
                if (!node.parents || node.parents.length === 0) {
                    parentlessNodes.push(node);
                }
            });
        });

        let result = "";
        parentlessNodes.forEach((node) => {
            result += node.treeString(0) + "\n";
        });
        return result;
    }

    static addRelation(parentName: string, childName: string, parentId: number = 0, childId: number = 0) {
        const parentNodes = this.registry.get(parentName);
        const childNodes = this.registry.get(childName);
        if (parentNodes && childNodes && parentNodes.length > parentId && childNodes.length > childId) {
            RefRegistryNode.addRelation(parentNodes[parentId], childNodes[childId]);
        }
    }

    static removeRelation(parentName: string, childName: string, parentId: number = 0, childId: number = 0) {
        const parentNodes = this.registry.get(parentName);
        const childNodes = this.registry.get(childName);
        if (parentNodes && childNodes && parentNodes.length > parentId && childNodes.length > childId) {
            RefRegistryNode.removeRelation(parentNodes[parentId], childNodes[childId]);
        }
    }

    static addReference(nodeName: string, id: number, ref: any) {
        if (this.allRefs.has(ref)) {
            console.log(`Reference for ${nodeName}_${id} already exists.`);
            return;
        }
        
        const nodes = this.registry.get(nodeName);

        if (!nodes || nodes.length <= id) {
            console.log(`No nodes found for ${nodeName} with id ${id}`);
            return;
        }

        if (RefRegistryNode.hasReference(nodes[id])) {
            console.log(`Node ${nodeName}_${id} already has a reference.`);
            return;
        }

        RefRegistryNode.addReference(nodes[id], ref);
        this.allRefs.add(ref);

    }

    static removeReference(nodeName: string, id: number) {
        const nodes = this.registry.get(nodeName);
        if (nodes && nodes.length > id) {
            RefRegistryNode.removeReference(nodes[id]);
            this.allRefs.delete(nodes[id].ref);
        }
    }

    static updateReference(nodeName: string, id: number, newRef: any) {
        const nodes = this.registry.get(nodeName);
        if (nodes && nodes.length > id) {
            RefRegistryNode.removeReference(nodes[id]);
            RefRegistryNode.addReference(nodes[id], newRef);
            this.allRefs.add(newRef);
        }
    }

    static sendSignalToAll(signal: SignalObject) {
        this.registry.forEach((nodes) => {
            nodes.forEach((node) => {
                if (node.ref && node.ref.receiveSignal) {
                    node.ref.receiveSignal(signal);
                }
            });
        });
    }
    
    static sendSignalTo(signal: SignalObject, className: string, id?: number) {
        const nodes = this.registry.get(className);
        if (!nodes) {
            return;
        }
        if (id !== undefined) {
            if (nodes.length > id) {
                const node = nodes[id];
                if (node.ref && node.ref.receiveSignal) {
                    node.ref.receiveSignal(signal);
                }
            }
        } else {
            nodes.forEach((node) => {
                if (node.ref && node.ref.receiveSignal) {
                    node.ref.receiveSignal(signal);
                }
            });
        }
    }

    static sendSignalToAllChildren(signal: SignalObject, nodeName: string, id: number = 0) {
        const children = this.getAllChildren(nodeName, id);
        children.forEach((child) => {
            if (child.ref && child.ref.receiveSignal) {
                child.ref.receiveSignal(signal);
            }
        });
    }

    private static getAllChildren(nodeName: string, id: number): RefRegistryNode[] {
        const  helper =  (node: RefRegistryNode, collected: Set<RefRegistryNode>) => {
            if (collected.has(node)) {
                return;
            }
            collected.add(node);
            if (node.children) {
                node.children.forEach((child) => {
                    helper(child, collected);
                });
            }
        }
        const nodes = this.registry.get(nodeName);
        if (!nodes || nodes.length <= id) {
            return [];
        }
        const collected = new Set<RefRegistryNode>();
        helper(nodes[id], collected);
        return Array.from(collected);
    }
}

// Apperently this allows you to just use in console
if (typeof window !== "undefined") {
    (window as any).RefRegistry = RefRegistry;
}
