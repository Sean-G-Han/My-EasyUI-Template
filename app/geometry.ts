import { Animated } from "react-native";

export type AnimNum = number | Animated.Value | Animated.AnimatedNode;

export type Point = "top-left" | "top-right" | "center" | "bottom-left" | "bottom-right";

export type Side = "top" | "right" | "bottom" | "left";

export type Direction = "center" | "left" | "right" | "up" | "down";

export type Size = {
    width: AnimNum;
    height: AnimNum;
};

export type Pos = {
    x: AnimNum;
    y: AnimNum;
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

    getSide(side: Side): AnimNum {
        const rect = this.getRect();
        switch(side) {
            case "top":
                return rect.y;
            case "right":
                return Animated.add(rect.x, rect.width);
            case "bottom":
                return Animated.add(rect.y, rect.height);
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
                const topRightX = Animated.add(rect.x, rect.width);
                return {x: topRightX, y: rect.y};
            case "bottom-left":
                const bottomLeftY = Animated.add(rect.y, rect.height);  
                return {x: rect.x, y: bottomLeftY};
            case "bottom-right":
                const bottomRightX = Animated.add(rect.x, rect.width);
                const bottomRightY = Animated.add(rect.y, rect.height);
                return {x: bottomRightX, y: bottomRightY};
            case "center":
                const centerX = Animated.add(rect.x, Animated.divide(rect.width, 2));
                const centerY = Animated.add(rect.y, Animated.divide(rect.height, 2));
                return {x: centerX, y: centerY};
        }
    }

    getRect(): XYWH {
        switch(this.referencePoint) {
            case "top-left":
                return {x: this.pos.x, y: this.pos.y, width: this.size.width, height: this.size.height};
            case "top-right":
                const topRightX = Animated.subtract(this.pos.x, this.size.width);
                return {x: topRightX, y: this.pos.y, width: this.size.width, height: this.size.height};
            case "bottom-left":
                const bottomLeftY = Animated.subtract(this.pos.y, this.size.height);
                return {x: this.pos.x, y: bottomLeftY, width: this.size.width, height: this.size.height};
            case "bottom-right":
                const bottomRightX = Animated.subtract(this.pos.x, this.size.width);
                const bottomRightY = Animated.subtract(this.pos.y, this.size.height);
                return {x: bottomRightX, y: bottomRightY, width: this.size.width, height: this.size.height};
            default:
                const centerX = Animated.subtract(this.pos.x, Animated.divide(this.size.width, 2));
                const centerY = Animated.subtract(this.pos.y, Animated.divide(this.size.height, 2));
                return {x: centerX, y: centerY, width: this.size.width, height: this.size.height};
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

        let width, height, x, y: AnimNum;

        if (corner1.x > corner2.x) {
            width = Animated.subtract(corner1.x, corner2.x);
            x = corner2.x;
        } else {
            width = Animated.subtract(corner2.x, corner1.x);
            x = corner1.x;
        }
        if (corner1.y > corner2.y) {
            height = Animated.subtract(corner1.y, corner2.y);
            y = corner2.y;
        } else {
            height = Animated.subtract(corner2.y, corner1.y);
            y = corner1.y;
        }

        return new Rectangle(
            { width: width, height: height},
            { x: x, y: y },
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