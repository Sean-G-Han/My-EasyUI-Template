import { Rectangle } from "./geometry";

class RectRegistryNode {
    rect: Rectangle;
    parents?: RectRegistryNode[] = [];
    children?: RectRegistryNode[] = [];
    constructor(rect: Rectangle) {
        this.rect = rect;
    }

    static addRelation(parent: RectRegistryNode, child: RectRegistryNode) {
        parent.children = parent.children || [];
        child.parents = child.parents || [];
        parent.children.push(child);
        child.parents.push(parent);
    }

    treeString(level: number = 0, isLast: boolean = true, prefix: string = ""): string {
        let result = "";

        const branch = level === 0 ? "" : (isLast ? "└── " : "├── ");
        result += prefix + branch + `${this.rect.name}\n`;

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
        return `RectRegistryNode(${this.rect.name}) => Parents: [${this.parents?.map(p => p.rect.name).join(", ")}], Children: [${this.children?.map(c => c.rect.name).join(", ")}]`;
    }
}

export class RectRegistry {
    private static registry: Map<string, RectRegistryNode> = new Map();

    static clear() {
        this.registry.clear();
    }

    static registerRect(rect: Rectangle) {
        const node = new RectRegistryNode(rect);
        this.registry.set(rect.name, node);
        return node;
    }

    static hasRect(rect: string|Rectangle): boolean {
        if (rect instanceof Rectangle) {
            rect = rect.name;
        }
        return this.registry.has(rect);
    }

    static toString(): string {
        let count = this.registry.size;
        let result = `RectRegistry {${count} rects} :\n`;
        this.registry.forEach((node, name) => {
            result += `  Rect: ${name}\n`;
            if (node.parents && node.parents.length > 0) {
                result += `    Parents: ${node.parents.map(p => p.rect.name).join(", ")}\n`;
            }
            if (node.children && node.children.length > 0) {
                result += `    Children: ${node.children.map(c => c.rect.name).join(", ")}\n`;
            }
        });
        return result;
    }

    static treeString(nodeName: string, level: number = 0): string {

        const node = this.registry.get(nodeName);
        if (!node) {
            return "";
        }

        return node.treeString(level);
    }
    
    static addRelation(parent: Rectangle, child: Rectangle) {
        const parentNode = this.registry.get(parent.name);
        const childNode = this.registry.get(child.name);
        if (parentNode && childNode) {
            RectRegistryNode.addRelation(parentNode, childNode);
        }
    }

    static getRectNode(rectName: string): RectRegistryNode | undefined {
        return this.registry.get(rectName);
    }
}

// Apperently this allows you to just use in console
if (typeof window !== "undefined") {
    (window as any).RectRegistry = RectRegistry;
}
    