export class referencePoint {
    static TOP_LEFT = "top-left";
    static TOP_RIGHT = "top-right";
    static CENTER = "center";
    static BOTTOM_LEFT = "bottom-left";
    static BOTTOM_RIGHT = "bottom-right";
}

export type XYWH = {
    x: number;
    y: number;
    width: number;
    height: number;
    reference: referencePoint;
};

export function create(x: number, y: number, width: number, height: number, reference: referencePoint = referencePoint.TOP_LEFT): XYWH {
    return { x, y, width, height, reference };
}

export function convertToTopLeft(xywh: XYWH): XYWH {
    let { x, y, width, height } = xywh;
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

function _getReferenceXY(xywh: XYWH): { x: number; y: number } {
    return { x: xywh.x, y: xywh.y };
}

function _setOffset(xywh: XYWH, offsetX: number, offsetY: number): XYWH {
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

export function attachTo(child: XYWH, childReference: referencePoint, parent: XYWH, parentReference: referencePoint, offsetX = 0, offsetY = 0): XYWH {
    let childXYWH = convertTo(_removeXY(child), childReference);
    let parentXYWH = convertTo(parent, parentReference);

    let parentRefXY = _getReferenceXY(parentXYWH);

    let deltaX = parentRefXY.x
    let deltaY = parentRefXY.y;

    return _setOffset(childXYWH, deltaX + offsetX, deltaY + offsetY);
}