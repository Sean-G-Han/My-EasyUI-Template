import { Animated, ViewStyle } from "react-native";
import { RefRegistry } from "./RefRegistry";

export type Point = "top-left" | "top-right" | "center" | "bottom-left" | "bottom-right";

export type Side = "top" | "right" | "bottom" | "left";

export type Size = {
    width: number;
    height: number;
};

export type Pos = {
    x: number;
    y: number;
};

export type XYWH = Pos & Size;

export type Constraint = {
    pos?: Pos;
    size?: Size;
    refCorner?: Point;
    rectCorners?: Array<[Rectangle, Point]>;
    rectSides?: Array<[Rectangle, Side]>;
    growDirection?: Side;
    growSize?: number;
}

export type RectWithContent = {
    rect: Rectangle;
    element?: React.ReactNode;
    style?: ViewStyle;
};

export type RectFactory = (parent: Rectangle) => RectWithContent[];

export class Rectangle {
    className: string = "unnamed-rectangle";
    id: number = 0;
    size: Size;
    pos: Pos;
    referencePoint: Point = "top-left";
    constructor(size: Size, pos: Pos, referencePoint?: Point, className?: string, id?: number) {
        this.size = size;
        this.pos = pos;
        if (referencePoint)
            this.referencePoint = referencePoint;
        if (className) {
            this.className = className;
            RefRegistry.registerRef(this.className, this.id);
        }
        if (id) {
            this.id = id;
        }
    }

    getSide(side: Side): number {
        const rect = this.getXYWH();
        switch(side) {
            case "top":
                return rect.y;
            case "right":
                return rect.x + rect.width;
            case "bottom":
                return rect.y + rect.height;
            case "left":
                return rect.x;
        }
    }

    getCorner(point: Point): Pos {
        const rect = this.getXYWH();
        switch(point) {
            case "top-left":
                return {x: rect.x, y: rect.y};
            case "top-right":
                const topRightX = rect.x + rect.width;
                return {x: topRightX, y: rect.y};
            case "bottom-left":
                const bottomLeftY = rect.y + rect.height;  
                return {x: rect.x, y: bottomLeftY};
            case "bottom-right":
                const bottomRightX = rect.x + rect.width;
                const bottomRightY = rect.y + rect.height;
                return {x: bottomRightX, y: bottomRightY};
            case "center":
                const centerX = rect.x + rect.width / 2;
                const centerY = rect.y + rect.height / 2;
                return {x: centerX, y: centerY};
        }
    }

    // Returns XYWH based on top left everytime
    getXYWH(): XYWH {
        switch(this.referencePoint) {
            case "top-left":
                return {x: this.pos.x, y: this.pos.y, width: this.size.width, height: this.size.height};
            case "top-right":
                const topRightX = this.pos.x - this.size.width;
                return {x: topRightX, y: this.pos.y, width: this.size.width, height: this.size.height};
            case "bottom-left":
                const bottomLeftY = this.pos.y - this.size.height;
                return {x: this.pos.x, y: bottomLeftY, width: this.size.width, height: this.size.height};
            case "bottom-right":
                const bottomRightX = this.pos.x - this.size.width;
                const bottomRightY = this.pos.y - this.size.height;
                return {x: bottomRightX, y: bottomRightY, width: this.size.width, height: this.size.height};
            default:
                const centerX = this.pos.x - this.size.width / 2;
                const centerY = this.pos.y - this.size.height / 2;
                return {x: centerX, y: centerY, width: this.size.width, height: this.size.height};
        }
    }

    private static fromSizePosRef(size: Size, pos: Pos, refCorner: Point, name?: string, id?: number): Rectangle {
        return new Rectangle(size, pos, refCorner, name, id);
    }

    private static fromSizePos(size: Size, pos: Pos, name?: string, id?: number): Rectangle {
        return new Rectangle(size, pos, "top-left", name, id);
    }

    private static from2Corners(r1: [Rectangle, Point], r2: [Rectangle, Point], name?: string, id?: number): Rectangle {
        const corner1 = r1[0].getCorner(r1[1]);
        const corner2 = r2[0].getCorner(r2[1]);

        return new Rectangle(
            { 
                width: Math.abs(corner2.x - corner1.x),
                height: Math.abs(corner2.y - corner1.y),
            },
            { x: Math.min(corner1.x, corner2.x), y: Math.min(corner1.y, corner2.y) },
            "top-left",
            name,
            id
        );
    }

    private static fromCornerAndSize(r: [Rectangle, Point], size: Size, refCorner: Point, name?: string, id?: number): Rectangle {
        const pos = r[0].getCorner(r[1]);
        return new Rectangle(size, pos, refCorner, name, id);
    }

    private static from4Sides(sides: [Rectangle, Side][], name?: string, id?: number): Rectangle {
        let constraintX: number[] = [];
        let constraintY: number[] = [];
        for (const side of sides) {
            const rect = side[0];
            const sideName = side[1];
            if (sideName === "left" || sideName === "right") {
                constraintX.push(rect.getSide(sideName));
            } else {
                constraintY.push(rect.getSide(sideName));
            }
        }

        if (constraintX.length !== 2 || constraintY.length !== 2) {
            return this.empty();
        }

        return this.from2Corners(
            [new Rectangle({width: 0, height: 0}, {x: constraintX[0], y: constraintY[0]}, "top-left", name, id), "top-left"],
            [new Rectangle({width: 0, height: 0}, {x: constraintX[1], y: constraintY[1]}, "top-left", name, id), "bottom-right"]
        );
    }

    private static from2AlignedCornersAndGD(corner1: [Rectangle, Point], corner2: [Rectangle, Point], growDirection: Side, growSize: number, name?: string, id?: number): Rectangle {
        const pos1 = corner1[0].getCorner(corner1[1]);
        const pos2 = corner2[0].getCorner(corner2[1]);

        if (pos1.x != pos2.x && pos1.y != pos2.y) {
            return this.from2Corners(corner1, corner2);
        }

        if (pos1.x == pos2.x && (growDirection === "bottom" || growDirection === "top")) {
            return this.empty();
        }

        if (pos1.y == pos2.y && (growDirection === "left" || growDirection === "right")) {
            return this.empty();
        }

        const x = Math.min(pos1.x, pos2.x);
        const y = Math.min(pos1.y, pos2.y);
        const pos: Pos = {x: x, y: y};

        switch(growDirection) {
            case "left":
                const sizeLeft: Size = {
                    width: growSize,
                    height: Math.abs(pos1.y - pos2.y),
                };
                return new Rectangle(sizeLeft, pos, "top-right", name, id);
            case "right":
                const sizeRight: Size = {
                    width: growSize,
                    height: Math.abs(pos1.y - pos2.y),
                };
                return new Rectangle(sizeRight, pos, "top-left", name, id);
            case "bottom":
                const sizeBottom: Size = {
                    width: Math.abs(pos1.x - pos2.x),
                    height: growSize,
                };
                return new Rectangle(sizeBottom, pos, "top-left", name, id);
            case "top":
                const sizeTop: Size = {
                    width: Math.abs(pos1.x - pos2.x),
                    height: growSize,
                };
                return new Rectangle(sizeTop, pos, "bottom-left", name, id);
            default:
                return this.empty();
        }
    }

    private static fromSideAndGD(side: [Rectangle, Side], growDirection: Side, growSize: number, name?: string, id?: number): Rectangle {
        const sideXYWH = side[0].getXYWH();
        const sidePos = side[0].getSide(side[1]);
        const sideName = side[1];
        let pos: Pos;
        let size: Size;

        if (sideName == "top" || sideName == "bottom") {
            if (growDirection == "left" || growDirection == "right") {
                return this.empty();
            }
        } else if (sideName == "left" || sideName == "right") {
            if (growDirection == "top" || growDirection == "bottom") {
                return this.empty();
            }
        }

        if (growDirection === "left" || growDirection === "right") {
            size = { width: growSize, height: sideXYWH.height };
            pos = { x: sidePos, y: sideXYWH.y };
            let referencePoint: Point = growDirection === "left" ? "top-right" : "top-left";
            return new Rectangle(size, pos, referencePoint, name, id);
        } else if (growDirection === "top" || growDirection === "bottom") {
            size = { width: sideXYWH.width, height: growSize };
            pos = { x: sideXYWH.x, y: sidePos };
            let referencePoint: Point = growDirection === "top" ? "bottom-left" : "top-left";
            return new Rectangle(size, pos, referencePoint, name, id);
        }
        return this.empty();
    }

    private static empty(): Rectangle {
        // TODO: Throw error instead?
        return new Rectangle({ width: 0, height: 0 }, { x: 0, y: 0 });
    }

    static create(constraint: Constraint, name?: string, id?: number): Rectangle {
        constraint = constraint || {};

        let rect: Rectangle = this.empty();
        let parentRect: Set<Rectangle> = new Set();

        if (constraint.size && constraint.pos && constraint.refCorner) {
            rect = this.fromSizePosRef(constraint.size, constraint.pos, constraint.refCorner, name, id);
        } else if (constraint.size && constraint.pos) {
            rect = this.fromSizePos(constraint.size, constraint.pos, name, id);
        } else if (constraint.rectCorners && constraint.rectCorners.length === 2 && constraint.growDirection && constraint.growSize) {
            const [r1, r2] = constraint.rectCorners;
            parentRect.add(r1[0]);
            parentRect.add(r2[0]);
            rect = this.from2AlignedCornersAndGD(r1, r2, constraint.growDirection, constraint.growSize, name, id);
        } else if (constraint.rectCorners && constraint.rectCorners.length === 2) {
            const [r1, r2] = constraint.rectCorners;
            parentRect.add(r1[0]);
            parentRect.add(r2[0]);
            rect = this.from2Corners(r1, r2, name, id);
        } else if (constraint.rectCorners && constraint.rectCorners.length === 1 && constraint.size && constraint.refCorner) {
            const [r1] = constraint.rectCorners;
            parentRect.add(r1[0]);
            rect = this.fromCornerAndSize(r1, constraint.size, constraint.refCorner, name, id);
        } else if (constraint.rectSides && constraint.rectSides.length === 4) {
            parentRect.add(constraint.rectSides[0][0]);
            parentRect.add(constraint.rectSides[1][0]);
            parentRect.add(constraint.rectSides[2][0]);
            parentRect.add(constraint.rectSides[3][0]);
            rect = this.from4Sides(constraint.rectSides, name, id);
        } else if (constraint.rectSides && constraint.rectSides.length === 1 && constraint.growDirection && constraint.growSize) {
            const [side] = constraint.rectSides;
            parentRect.add(side[0]);
            rect = this.fromSideAndGD(side, constraint.growDirection, constraint.growSize, name, id);
        }
        
        parentRect.forEach((p) => {
            RefRegistry.addRelation(p.className, rect.className, p.id, rect.id);
        });

        return rect;
    }

    public toString(): string {
        const xywh = this.getXYWH();    
        return `Rectangle(x: ${xywh.x}, y: ${xywh.y}, width: ${xywh.width}, height: ${xywh.height})`;
    }
}