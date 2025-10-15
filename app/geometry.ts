export type Point = "top-left" | "top-right" | "center" | "bottom-left" | "bottom-right";

export type Side = "top" | "right" | "bottom" | "left";

export type Direction = "center" | "left" | "right" | "up" | "down";

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
    ref?: Point;
    rectCorners?: Array<[Rectangle, Point]>;
    rectSides?: Array<[Rectangle, Side]>;
    growDirection?: Direction;
    growSize?: number;
}

export class Rectangle {
    size: Size;
    pos: Pos;
    referencePoint: Point = "top-left";
    constructor(size: Size, pos: Pos, referencePoint?: Point) {
        this.size = size;
        this.pos = pos;
        if (referencePoint)
            this.referencePoint = referencePoint;
    }

    getSide(side: Side): number {
        const rect = this.getRect();
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
        const rect = this.getRect();
        switch(point) {
            case "top-left":
                return {x: rect.x, y: rect.y};
            case "top-right":
                return {x: rect.x + rect.width, y: rect.y};
            case "bottom-left":
                return {x: rect.x, y: rect.y + rect.height};
            case "bottom-right":
                return {x: rect.x + rect.width, y: rect.y + rect.height};
            case "center":
                return {x: rect.x + rect.width/2, y: rect.y + rect.height/2};
        }
    }

    getRect(): XYWH {
        switch(this.referencePoint) {
            case "top-left":
                return {x: this.pos.x, y: this.pos.y, width: this.size.width, height: this.size.height};
            case "top-right":
                return {x: this.pos.x-this.size.width, y: this.pos.y, width: this.size.width, height: this.size.height};
            case "bottom-left":
                return {x: this.pos.x, y: this.pos.y-this.size.height, width: this.size.width, height: this.size.height};
            case "bottom-right":
                return {x: this.pos.x-this.size.width, y: this.pos.y-this.size.height, width: this.size.width, height: this.size.height};
            default:
                return {x: this.pos.x-this.size.width/2, y: this.pos.y-this.size.height/2, width: this.size.width, height: this.size.height};
        }
    }

    private static fromSizePosRef(size: Size, pos: Pos, ref: Point): Rectangle {
        return new Rectangle(size, pos, ref);
    }

    private static fromSizePos(size: Size, pos: Pos): Rectangle {
        return new Rectangle(size, pos, "top-left");
    }

    private static fromTwoCorners(r1: [Rectangle, Point], r2: [Rectangle, Point]): Rectangle {
        const corner1 = r1[0].getCorner(r1[1]);
        const corner2 = r2[0].getCorner(r2[1]);

        return new Rectangle(
            {
                width: Math.abs(corner2.x - corner1.x),
                height: Math.abs(corner2.y - corner1.y),
            },
            { x: Math.min(corner1.x, corner2.x), y: Math.min(corner1.y, corner2.y) }
        );
    }

    private static fromCornerAndSize(r: [Rectangle, Point], size: Size, ref: Point): Rectangle {
        const pos = r[0].getCorner(r[1]);
        return new Rectangle(size, pos, ref);
    }

    private static empty(): Rectangle {
        return new Rectangle({ width: 0, height: 0 }, { x: 0, y: 0 });
    }

    static create(constraint: Constraint): Rectangle {
        constraint = constraint || {};

        if (constraint.size && constraint.pos && constraint.ref) {
            return this.fromSizePosRef(constraint.size, constraint.pos, constraint.ref);
        } else if (constraint.size && constraint.pos) {
            return this.fromSizePos(constraint.size, constraint.pos);
        } else if (constraint.rectCorners && constraint.rectCorners.length === 2) {
            const [r1, r2] = constraint.rectCorners;
            return this.fromTwoCorners(r1, r2);
        } else if (constraint.rectCorners && constraint.rectCorners.length === 1 && constraint.size && constraint.ref) {
            const [r1] = constraint.rectCorners;
            return this.fromCornerAndSize(r1, constraint.size, constraint.ref);
        }   // TODO: Add more constraint handling here
            // e.g., 4 sides, 1 side + grow, etc.

        return this.empty();
    }
}