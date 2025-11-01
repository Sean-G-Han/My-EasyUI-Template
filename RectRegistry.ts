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

    static addRelation(parent: Rectangle, child: Rectangle) {
        const parentNode = this.registry.get(parent.name);
        const childNode = this.registry.get(child.name);
        if (parentNode && childNode) {
            RectRegistryNode.addRelation(parentNode, childNode);
        }
    }
}

if (typeof window !== "undefined") {
    (window as any).RectRegistry = RectRegistry;
}
    