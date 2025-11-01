import { Animated } from "react-native";

export type AnimNum = number | Animated.Value | Animated.AnimatedNode;

export type Point = "top-left" | "top-right" | "center" | "bottom-left" | "bottom-right";

export type Side = "top" | "right" | "bottom" | "left";

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
    refCorner?: Point;
    rectCorners?: Array<[Rectangle, Point]>;
    rectSides?: Array<[Rectangle, Side]>;
    growDirection?: Side;
    growSize?: AnimNum;
}

export class AnimMath {
    static toAnimated(value: AnimNum): Animated.Value {
        if (typeof value === "number") {
            return new Animated.Value(value);
        } else {
            return value as Animated.Value;
        }
    }

    static toNumber(value: AnimNum): number {
        if (typeof value === "number") {
            return value;
        } else {
            return (value as any).__getValue();
        }
    }

    static Abs(value: AnimNum) {
        const animValue = this.toAnimated(value);
        return animValue.interpolate({
            inputRange: [-10000, 0, 10000],
            outputRange: [10000, 0, 10000],
        });
    }

    static Min(v1: AnimNum, v2: AnimNum) {
        const a = this.toAnimated(v1);
        const b = this.toAnimated(v2);
        const diff = Animated.subtract(a, b);
        const min = Animated.add(
            b,
            diff.interpolate({
                inputRange: [-10000, 0, 10000],
                outputRange: [-10000, 0, 0],
            })
        );
        return min;
    }

    static Max(v1: AnimNum, v2: AnimNum) {
        const a = this.toAnimated(v1);
        const b = this.toAnimated(v2);
        const diff = Animated.subtract(a, b);
        const max = Animated.add(
            b,
            diff.interpolate({
                inputRange: [-10000, 0, 10000],
                outputRange: [0, 0, 10000],
            })
        );
        return max;
    }
}

export type RectWithContent = {
    rect: Rectangle;
    element?: React.ReactNode;
};

export type RectFactory = (parent: Rectangle) => RectWithContent[];

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
        const rect = this.getXYWH();
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
        const rect = this.getXYWH();
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

    // Returns XYWH based on top left everytime
    getXYWH(): XYWH {
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

    private static fromSizePosRef(size: Size, pos: Pos, refCorner: Point): Rectangle {
        return new Rectangle(size, pos, refCorner);
    }

    private static fromSizePos(size: Size, pos: Pos): Rectangle {
        return new Rectangle(size, pos, "top-left");
    }

    private static from2Corners(r1: [Rectangle, Point], r2: [Rectangle, Point]): Rectangle {
        const corner1 = r1[0].getCorner(r1[1]);
        const corner2 = r2[0].getCorner(r2[1]);

        return new Rectangle(
            { 
                width: AnimMath.Abs(Animated.subtract(corner2.x, corner1.x)),
                height: AnimMath.Abs(Animated.subtract(corner2.y, corner1.y)),
            },
            { x: AnimMath.Min(corner1.x, corner2.x), y: AnimMath.Min(corner1.y, corner2.y) },
        );
    }

    private static fromCornerAndSize(r: [Rectangle, Point], size: Size, refCorner: Point): Rectangle {
        const pos = r[0].getCorner(r[1]);
        return new Rectangle(size, pos, refCorner);
    }

    private static from4Sides(sides: [Rectangle, Side][]): Rectangle {
        let constraintX: AnimNum[] = [];
        let constraintY: AnimNum[] = [];
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
            [new Rectangle({width: 0, height: 0}, {x: constraintX[0], y: constraintY[0]}), "top-left"],
            [new Rectangle({width: 0, height: 0}, {x: constraintX[1], y: constraintY[1]}), "bottom-right"]
        );
    }

    private static from2AlignedCornersAndGD(corner1: [Rectangle, Point], corner2: [Rectangle, Point], growDirection: Side, growSize: AnimNum): Rectangle {
        const pos1 = corner1[0].getCorner(corner1[1]);
        const pos2 = corner2[0].getCorner(corner2[1]);

        if (pos1.x !== pos2.x && pos1.y !== pos2.y) {
            return this.from2Corners(corner1, corner2);
        }

        if (pos1.x === pos2.x && (growDirection === "bottom" || growDirection === "top")) {
            return this.empty();
        }

        if (pos1.y === pos2.y && (growDirection === "left" || growDirection === "right")) {
            return this.empty();
        }

        const x = AnimMath.Min(pos1.x, pos2.x);
        const y = AnimMath.Min(pos1.y, pos2.y);
        const pos: Pos = {x: x, y: y};

        switch(growDirection) {
            case "left":
                const sizeLeft: Size = {
                    width: growSize,
                    height: AnimMath.Abs(Animated.subtract(pos1.y, pos2.y)),
                };
                return new Rectangle(sizeLeft, pos, "top-right");
            case "right":
                const sizeRight: Size = {
                    width: growSize,
                    height: AnimMath.Abs(Animated.subtract(pos1.y, pos2.y)),
                };
                return new Rectangle(sizeRight, pos, "top-left");
            case "bottom":
                const sizeBottom: Size = {
                    width: AnimMath.Abs(Animated.subtract(pos1.x, pos2.x)),
                    height: growSize,
                };
                return new Rectangle(sizeBottom, pos, "top-left");
            case "top":
                const sizeTop: Size = {
                    width: AnimMath.Abs(Animated.subtract(pos1.x, pos2.x)),
                    height: growSize,
                };
                return new Rectangle(sizeTop, pos, "bottom-left");
            default:
                return this.empty();
        }
    }

    private static fromSideAndGD(side: [Rectangle, Side], growDirection: Side, growSize: AnimNum): Rectangle {
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
            return new Rectangle(size, pos, referencePoint);
        } else if (growDirection === "top" || growDirection === "bottom") {
            size = { width: sideXYWH.width, height: growSize };
            pos = { x: sideXYWH.x, y: sidePos };
            let referencePoint: Point = growDirection === "top" ? "bottom-left" : "top-left";
            return new Rectangle(size, pos, referencePoint);
        }
        return this.empty();
    }

    private static empty(): Rectangle {
        // TODO: Throw error instead?
        return new Rectangle({ width: 0, height: 0 }, { x: 0, y: 0 });
    }

    static create(constraint: Constraint): Rectangle {
        constraint = constraint || {};


        if (constraint.size && constraint.pos && constraint.refCorner) {
            return this.fromSizePosRef(constraint.size, constraint.pos, constraint.refCorner);
        } else if (constraint.size && constraint.pos) {
            return this.fromSizePos(constraint.size, constraint.pos);
        } else if (constraint.rectCorners && constraint.rectCorners.length === 2 && constraint.growDirection && constraint.growSize) {
            const [r1, r2] = constraint.rectCorners;
            return this.from2AlignedCornersAndGD(r1, r2, constraint.growDirection, constraint.growSize);
        } else if (constraint.rectCorners && constraint.rectCorners.length === 2) {
            const [r1, r2] = constraint.rectCorners;
            return this.from2Corners(r1, r2);
        } else if (constraint.rectCorners && constraint.rectCorners.length === 1 && constraint.size && constraint.refCorner) {
            const [r1] = constraint.rectCorners;
            return this.fromCornerAndSize(r1, constraint.size, constraint.refCorner);
        } else if (constraint.rectSides && constraint.rectSides.length === 4) {
            return this.from4Sides(constraint.rectSides);
        } else if (constraint.rectSides && constraint.rectSides.length === 1 && constraint.growDirection && constraint.growSize) {
            const [side] = constraint.rectSides;
            return this.fromSideAndGD(side, constraint.growDirection, constraint.growSize);
        }

        return this.empty();
    }

    public toString(): string {
        const xywh = this.getXYWH();    
        return `Rectangle(x: ${AnimMath.toNumber(xywh.x)}, y: ${AnimMath.toNumber(xywh.y)}, width: ${AnimMath.toNumber(xywh.width)}, height: ${AnimMath.toNumber(xywh.height)})`;
    }
}