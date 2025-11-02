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

    static addReference(node: RefRegistryNode, ref: any) {
        node.ref = ref;
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
        const noRef = this.ref ? ` ${GREEN}(Referenced)${RESET}` : ` ${RED}(No Reference)${RESET}`;

        result += prefix + branch + `${classPart}_${idPart}${noRef}\n`;

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


    toString(): string {
        return `RefRegistryNode(className=${this.className}, id=${this.id}) => Parents: [${this.parents?.map(p => p.toString()).join(", ")}], Children: [${this.children?.map(c => c.toString()).join(", ")}]`;
    }
}

export class RefRegistry {
    private static registry: Map<string, Array<RefRegistryNode>> = new Map();

    static clear() {
        console.log("Clearing RefRegistry");
        this.registry.clear();
    }

    static registerRef(className: string, id: number): RefRegistryNode {
        const node = new RefRegistryNode(className, id);
        const existingNodes = this.registry.get(className) || [];
        existingNodes[id] = node; // dont use push() in case id != pos (e.g. if skipped)
        this.registry.set(className, existingNodes);
        return node;
    }

    static getNumberOfClass(className: string): number {
        const nodes = this.registry.get(className);
        return nodes ? nodes.length : 0;
    }

    static treeString(nodeName: string, level: number = 0): string {
        const id = nodeName.lastIndexOf("_") >= 0 ? parseInt(nodeName.substring(nodeName.lastIndexOf("_") + 1)) : 0;
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

    static addReference(nodeName: string, id: number, ref: any) {
        const nodes = this.registry.get(nodeName);
        if (nodes && nodes.length > id) {
            RefRegistryNode.addReference(nodes[id], ref);
        }
    }

    static highlightAll(isOn:boolean=true) {
        this.registry.forEach((nodes) => {
            nodes.forEach((node) => {
                if (node.ref && node.ref.highlight) {
                    node.ref.highlight(isOn);
                }
            });
        });
    }

    static highlight(name: string, isOn: boolean = true, optional_id?: number) {
        if (optional_id !== undefined) {
            const nodes = this.registry.get(name);
            if (nodes && nodes.length > (optional_id || 0)) {
                const node = nodes[optional_id || 0];
                if (node.ref && node.ref.highlight) {
                    node.ref.highlight(isOn);
                }
            }
        } else {
            const nodes = this.registry.get(name);
            if (nodes) {
                nodes.forEach((node) => {
                    if (node.ref && node.ref.highlight) {
                        node.ref.highlight(isOn);
                    }
                });
            }
        }
    }

}

// Apperently this allows you to just use in console
if (typeof window !== "undefined") {
    (window as any).RefRegistry = RefRegistry;
}
