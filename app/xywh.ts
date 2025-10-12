export class referencePoint {
    static TOP_LEFT = "top-left";
    static TOP_RIGHT = "top-right";
    static CENTER = "center";
    static BOTTOM_LEFT = "bottom-left";
    static BOTTOM_RIGHT = "bottom-right";
}

export type Size = {
    width: number;
    height: number;
};

export type Pos = {
    x: number;
    y: number;
};

export type XYWH = Size & Pos & {
    reference: referencePoint;
};

export function copy(xywh: XYWH): XYWH {
    return { x: xywh.x, y: xywh.y, width: xywh.width, height: xywh.height, reference: xywh.reference };
}

export function create(x: number, y: number, width: number, height: number, reference: referencePoint = referencePoint.TOP_LEFT): XYWH {
    return { x, y, width, height, reference };
}

export function createFromCorners(x1: number, y1: number, x2: number, y2: number, reference: referencePoint = referencePoint.TOP_LEFT): XYWH {
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const maxX = Math.max(x1, x2);
    const maxY = Math.max(y1, y2);
    return convertTo({ x: minX, y: minY, width: maxX - minX, height: maxY - minY, reference: referencePoint.TOP_LEFT }, reference);
}

export function createPos(x: number, y: number): Pos {
    return { x, y };
}

export function convertToTopLeft(xywh: XYWH): XYWH {
    let { x, y, width, height } = copy(xywh);
    switch (xywh.reference) {
        case referencePoint.TOP_LEFT:
            break;
        case referencePoint.TOP_RIGHT:
            x = x - width;
            break;
        case referencePoint.CENTER:
            x = x - width / 2;
            y = y - height / 2;
            break;
        case referencePoint.BOTTOM_LEFT:
            y = y - height;
            break;
        case referencePoint.BOTTOM_RIGHT:
            x = x - width;
            y = y - height;
            break;
    }
    return { x, y, width, height, reference: referencePoint.TOP_LEFT };
}

export function convertTo(xywh: XYWH, reference: referencePoint): XYWH {
    let { x, y, width, height } = convertToTopLeft(xywh);
    switch (reference) {
        case referencePoint.TOP_LEFT:
            break;
        case referencePoint.TOP_RIGHT:
            x = x + width;
            break;
        case referencePoint.CENTER:
            x = x + width / 2;
            y = y + height / 2;
            break;
        case referencePoint.BOTTOM_LEFT:
            y = y + height;
            break;
        case referencePoint.BOTTOM_RIGHT:
            x = x + width;
            y = y + height;
            break;
    }
    return { x, y, width, height, reference };
}

function _getXY(xywh: XYWH): Pos {
    return { x: xywh.x, y: xywh.y };
}

function _setXY(xywh: XYWH, offsetX: number, offsetY: number): XYWH {
    return { x: offsetX, y: offsetY, width: xywh.width, height: xywh.height, reference: xywh.reference };
}

function _removeXY(xywh: XYWH): XYWH {
    return { x: 0, y: 0, width: xywh.width, height: xywh.height, reference: xywh.reference };
}

export function toString(xywh: XYWH): string {
    return `x: ${xywh.x}, y: ${xywh.y}`;
}

export function toStringDetail(xywh: XYWH): string {
    return `
    top-left(${toString(convertToTopLeft(xywh))}), 
    top-right(${toString(convertTo(xywh, referencePoint.TOP_RIGHT))}), 
    center(${toString(convertTo(xywh, referencePoint.CENTER))}), 
    bottom-left(${toString(convertTo(xywh, referencePoint.BOTTOM_LEFT))}), 
    bottom-right(${toString(convertTo(xywh, referencePoint.BOTTOM_RIGHT))})
    reference: ${xywh.reference}
    width: ${xywh.width}, height: ${xywh.height}
    xy: ${toString(xywh)}`;
}

export function attachRigidTo(child: XYWH, childReference: referencePoint, parent: XYWH, parentReference: referencePoint, offset: Pos = { x: 0, y: 0 }): XYWH {
    let childXYWH = convertTo(_removeXY(child), childReference);
    let parentXYWH = convertTo(parent, parentReference);

    let parentRefXY = _getXY(parentXYWH);

    let deltaX = parentRefXY.x
    let deltaY = parentRefXY.y;

    return _setXY(childXYWH, deltaX + offset.x, deltaY + offset.y);
}

export function attachFlexTo(
        parent1: XYWH, 
        parent1Reference: referencePoint, 
        parent2: XYWH, 
        parent2Reference: referencePoint, 
        offset1: Pos = { x: 0, y: 0 }, 
        offset2: Pos = { x: 0, y: 0 }, 
        growDirection: "CENTER" | "LEFT" | "RIGHT" | "UP" | "DOWN" = "CENTER",
        growSize: number = 0
    ): XYWH {
    let parent1XYWH = convertTo(parent1, parent1Reference);
    let parent2XYWH = convertTo(parent2, parent2Reference);

    let parent1RefXY = _getXY(parent1XYWH);
    let parent2RefXY = _getXY(parent2XYWH);

    if (parent1RefXY.y === parent2RefXY.y) {
        if (!growDirection || !growSize) {
            throw new Error("growDirection and growSize must be provided when parent1RefXY.y === parent2RefXY.y");
        }

        switch (growDirection) {
            case "LEFT":
                throw new Error("growDirection cannot be LEFT when parent1RefXY.y === parent2RefXY.y");
            case "RIGHT":
                throw new Error("growDirection cannot be RIGHT when parent1RefXY.y === parent2RefXY.y");
            case "UP":
                return createFromCorners(
                    parent1RefXY.x + offset1.x,
                    parent1RefXY.y + offset1.y - growSize,
                    parent2RefXY.x + offset2.x,
                    parent2RefXY.y + offset2.y,
                );
            case "DOWN":
                return createFromCorners(
                    parent1RefXY.x + offset1.x,
                    parent1RefXY.y + offset1.y + growSize,
                    parent2RefXY.x + offset2.x,
                    parent2RefXY.y + offset2.y,
                );
            case "CENTER":
                return createFromCorners(
                    parent1RefXY.x + offset1.x,
                    parent1RefXY.y + offset1.y - growSize / 2,
                    parent2RefXY.x + offset2.x,
                    parent2RefXY.y + offset2.y + growSize / 2,
                );
        }
    } else if (parent1RefXY.x === parent2RefXY.x) {
        if (!growDirection || !growSize) {
            throw new Error("growDirection and growSize must be provided when parent1RefXY.x === parent2RefXY.x");
        }

        switch (growDirection) {
            case "LEFT":
                return createFromCorners(
                    parent1RefXY.x + offset1.x - growSize,
                    parent1RefXY.y + offset1.y,
                    parent2RefXY.x + offset2.x,
                    parent2RefXY.y + offset2.y,
                );
            case "RIGHT":
                return createFromCorners(
                    parent1RefXY.x + offset1.x + growSize,
                    parent1RefXY.y + offset1.y,
                    parent2RefXY.x + offset2.x,
                    parent2RefXY.y + offset2.y,
                );
            case "CENTER":
                return createFromCorners(
                    parent1RefXY.x + offset1.x - growSize / 2,
                    parent1RefXY.y + offset1.y,
                    parent2RefXY.x + offset2.x + growSize / 2,
                    parent2RefXY.y + offset2.y,
                );
            case "UP":
                throw new Error("growDirection cannot be UP when parent1RefXY.x === parent2RefXY.x");
            case "DOWN":
                throw new Error("growDirection cannot be DOWN when parent1RefXY.x === parent2RefXY.x");
        }   
    }

    return createFromCorners(
        parent1RefXY.x + offset1.x,
        parent1RefXY.y + offset1.y,
        parent2RefXY.x + offset2.x,
        parent2RefXY.y + offset2.y,
        referencePoint.TOP_LEFT
    );
}