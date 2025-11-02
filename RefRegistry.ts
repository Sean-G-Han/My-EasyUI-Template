import { Rectangle } from "./geometry";

class RefRegistryNode {
    rect: Rectangle;
    ref?: any;// temp placeholder before I find out what type ref is
    parents?: RefRegistryNode[] = [];
    children?: RefRegistryNode[] = [];
    constructor(rect: Rectangle) {
        this.rect = rect;
    }

    static addRelation(parent: RefRegistryNode, child: RefRegistryNode) {
        parent.children = parent.children || [];
        child.parents = child.parents || [];
        parent.children.push(child);
        child.parents.push(parent);
    }

    treeString(level: number = 0, isLast: boolean = true, prefix: string = ""): string {
        let result = "";

        const branch = level === 0 ? "" : (isLast ? "└── " : "├── ");
        result += prefix + branch + `${this.rect.className}_${this.rect.id}\n`;

        if (this.children && this.children.length > 0) {
            const newPrefix = prefix + (level === 0 ? "" : (isLast ? "    " : "│   "));
            const lastIndex = this.children.length - 1;

            this.children.forEach((child, i) => {
                const last = i === lastIndex;
                result += child.treeString(level + 1, last, newPrefix);
            });
        }

        return result;
    }

    toString(): string {
        return `RefRegistryNode(className=${this.rect.className}, id=${this.rect.id}) => Parents: [${this.parents?.map(p => p.toString()).join(", ")}], Children: [${this.children?.map(c => c.toString()).join(", ")}]`;
    }
}

export class RefRegistry {
    private static registry: Map<string, Array<RefRegistryNode>> = new Map();

    static clear() {
        this.registry.clear();
    }

    static registerRect(rect: Rectangle): RefRegistryNode {
        const node = new RefRegistryNode(rect);
        const existingNodes = this.registry.get(rect.className) || [];
        existingNodes.push(node);
        this.registry.set(rect.className, existingNodes);
        return node;
    }

    static getNumberOfClass(rect: string|Rectangle): number {
        const rectName = rect instanceof Rectangle ? rect.className : rect;
        const nodes = this.registry.get(rectName);
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
}

// Apperently this allows you to just use in console
if (typeof window !== "undefined") {
    (window as any).RefRegistry = RefRegistry;
}
