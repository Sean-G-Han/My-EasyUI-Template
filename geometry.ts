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
    refCorner?: Point;
    rectCorners?: Array<[Rectangle, Point]>;
    rectSides?: Array<[Rectangle, Side]>;
    growDirection?: Direction;
    growSize?: number;
}

class AnimMath {
    static toAnimated(value: AnimNum): Animated.Value {
        if (typeof value === "number") {
            return new Animated.Value(value);
        } else {
            return value as Animated.Value;
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

    private static fromTwoCorners(r1: [Rectangle, Point], r2: [Rectangle, Point]): Rectangle {
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

    private static fromFourSides(sides: [Rectangle, Side][]): Rectangle {
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

        return this.fromTwoCorners(
            [new Rectangle({width: 0, height: 0}, {x: constraintX[0], y: constraintY[0]}), "top-left"],
            [new Rectangle({width: 0, height: 0}, {x: constraintX[1], y: constraintY[1]}), "bottom-right"]
        );
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
        } else if (constraint.rectCorners && constraint.rectCorners.length === 2) {
            const [r1, r2] = constraint.rectCorners;
            return this.fromTwoCorners(r1, r2);
        } else if (constraint.rectCorners && constraint.rectCorners.length === 1 && constraint.size && constraint.refCorner) {
            const [r1] = constraint.rectCorners;
            return this.fromCornerAndSize(r1, constraint.size, constraint.refCorner);
        } else if (constraint.rectSides && constraint.rectSides.length === 4) {
            return this.fromFourSides(constraint.rectSides);
        } // TODO: More Constraint combinations

        return this.empty();
    }
}