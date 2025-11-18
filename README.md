# CommonUI Template

A lightweight **React Native UI template** for building layouts using **constraints**, similar to Autodesk-style layout programs. Components are positioned and sized using **`Rect`** objects and a **constraint-based system**, allowing flexible and precise UI placement.

## Table of Contents
- [Features](#Features)
- [Introduction](#Introduction)
- [Usage](#Usage)
    - [Rect System](#Rect)
    - [CUIAbsoluteBox](#AbsoluteBox)
    - [RefRegistry](#RefRegistry)
    - [Signals](#Signals)

## Features

- **Constraint-based layout**: Attach UI elements relative to parent rectangles or other elements.  
- **Rectangle abstraction**: Each UI element is represented as a `Rectangle`, making size, position, and growth behavior explicit.
- **React context-based**: Automatic propagation of layout context via `RectContext` for nested components.  


## Getting Started

If you want to use only the library (without the full project), you can add the `library-only` branch as a submodule in your own project:

```bash
git submodule add -b library-only https://github.com/Sean-G-Han/project-a.git path/to/library
git submodule update --init --recursive
```

After that, import the components as you would any React component, e.g.

`import CUIAbsoluteBox from './EasyUI/CommonUI/CUIAbsoluteBox';;`

If the library code in library-only is updated, pull the latest changes in your project:

`git submodule update --remote --merge`

# Usage
## Rect System
### Introduction to Rect
Rects (short for rectangles) are the main buildng blocks of the EasyUI system.

They are defined using the `create` factory method which takes in a set of constraints. The Rect generated can then be injected into "Box" Components to display thee items. For example, 

```
// Custom function. Imo, make things neater
function useLayoutRects(window: { width: number; height: number }) {
    return React.useMemo(() => {
        RefRegistry.clear();
        const root = Rectangle.create({
            size: { width: window.width, height: window.height },
            pos: { x: 0, y: 0 },
        }, "root");

        return { root };
    }, [window.width, window.height]);
}

function Example() {
    const window = useWindowDimensions();
    const { root } = useLayoutRects(window);

    return (
        <CUIAbsoluteBox rect={root}>

        </CUIAbsoluteBox>
    );
}

export default React.memo(Example);
export { RefRegistry };
```

The above example is a bit of an overkill way to create a ``View`` that fits the entire screen. As you can see, we are using the size+pos constraints to define the rectangle. That said, the main advantage of EasyUI is the ability to use existing rects as reference. For Example,

```
const root = Rectangle.create({
    size: { width: window.width, height: window.height },
    pos: { x: 0, y: 0 },
}, "root");

const tl = Rectangle.create({
    size: { width: 100, height: 100 },
    refCorner: "top-left",
    rectCorners: [[root, "top-left"]],
}, "tl-box");

//...

<CUIAbsoluteBox rect={root}>
    <CUIAbsoluteBox rect={tl} style={{ backgroundColor: 'lightgreen' }} />
</CUIAbsoluteBox>
```

In this example, I am adding a coloured rectangle to the top-left of the root. This is done by attaching the top-left corner of a 100x100 Rect to the top-left corner of the root. Keep in mind, in this example, the child box is inside the parent box to better illustrate the relationship. Feel free to unnest them; it doesn't really matter.

```
<CUIAbsoluteBox rect={root}/>
<CUIAbsoluteBox rect={tl} style={{ backgroundColor: 'lightgreen' }} />
```
### How to Use `Rect.create` (i.e. constraints)
The `Rect.create` factory function takes in a type `Constraint` object as well as a name (which is used in `RefRegistry`)
```
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

export type Constraint = {
    pos?: Pos;
    size?: Size;
    refCorner?: Point;
    rectCorners?: Array<[Rectangle, Point]>;
    rectSides?: Array<[Rectangle, Side]>;
    growDirection?: Side;
    growSize?: number;
}
```
This design probably seems a bit strange, but it is based of engineering software like AutoCad where users can specify any constraints they want. When the software has enough information to confirm the size and position of an object, it assigns it to the object.

## AbsoluteBox

AbsoluteBoxes is the main way to structure the code. It takes in a Rect object as a parameter and renders it as an `View` component. As such, you can add other child components as you would a regular `View` component.

```
<CUIAbsoluteBox rect={root}>
    <Button/>
</CUIAbsoluteBox>
```

In the event youu prefer something more dynamic, I would recommend creaating your own components seperately and adding them to the main file. Below is an example of how  to create your own component with EasyUI

```
type Props = {
    rect: Rectangle;
};

const DUIExample = (props: Props) => {
    const sidebar = Rectangle.create({
        rectSides: [[props.rect, "left"]],
        growDirection: "right",
        growSize: 150,
    }, "sidebar-box");

    const contentArea = Rectangle.create({
        rectCorners: [[sidebar, "top-right"], [props.rect, "bottom-right"]],
    }, "content-area-box");

    const bottomArea = Rectangle.create({
        rectCorners: [[sidebar, "bottom-right"], [props.rect, "bottom-right"]],
        growDirection: "top",
        growSize: 300,
    }, "bottom-area-box");

    return (
        <CUIAbsoluteBox rect={props.rect}>
            <CUIAbsoluteBox rect={sidebar} style={{ backgroundColor: 'lightgray' }} />

            <CUIAbsoluteBox rect={contentArea} padding={20}>
                <CUITextField type="email" placeholder="Enter your email" value={email} onChangeText={setEmail} />
                <CUITextField type="password" placeholder="Enter your password" value={password} onChangeText={setPassword} />
                <CUIButton text="Submit" onPress={() => { console.log("Button Pressed") }} />
            </CUIAbsoluteBox>
        </CUIAbsoluteBox>
    )
}
```

In the above example I am passing in a Rectangle as a prop, but you can use a fixed rectaangle if that is better.

## RefRegistry

RefRegistry is a data structure that keeps track of all the `Rect` created and their associated box components, while also serving as a signal bus for all the other components. The RefRegistry is automatically updated whenever a rectangle is created, creating a tree representing the relations off all CUI-Components. You can see the tree generated in console using `console.log(RefRegistry.treeStringAll())`. Below is an example of a tree generated.

```
root (id: 0) (Referenced)
├── tl-box (id: 0) (No Reference)
│   └── header-box (id: 0) (Referenced)
│       ├── tl-header-box (id: 0) (Referenced)
│       └── body-box (id: 0) (Referenced)
│           ├── sidebar-box (id: 0) (Referenced)
│           │   ├── content-area-box (id: 0) (Referenced)
│           │   └── bottom-area-box (id: 0) (Referenced)
│           ├── content-area-box (id: 0) (Referenced)
│           └── bottom-area-box (id: 0) (Referenced)
├── tr-box (id: 0) (No Reference)
│   └── header-box (id: 0) (Referenced)
│       ├── tl-header-box (id: 0) (Referenced)
│       └── body-box (id: 0) (Referenced)
│           ├── sidebar-box (id: 0) (Referenced)
│           │   ├── content-area-box (id: 0) (Referenced)
│           │   └── bottom-area-box (id: 0) (Referenced)
│           ├── content-area-box (id: 0) (Referenced)
│           └── bottom-area-box (id: 0) (Referenced)
├── br-box (id: 0) (No Reference)
└── bl-box (id: 0) (No Reference)
    └── body-box (id: 0) (Referenced)
        ├── sidebar-box (id: 0) (Referenced)
        │   ├── content-area-box (id: 0) (Referenced)
        │   └── bottom-area-box (id: 0) (Referenced)
        ├── content-area-box (id: 0) (Referenced)
        └── bottom-area-box (id: 0) (Referenced)
```

Note: You may notice that some components appear more than once, this is because they rely on more than 1 parent and as such appear multiple times.
Note2: "Reference" refers to if there is a component attached to the Rectangle. In this case, tl-box and friends are margin boxes and are not attached to a CUI-Component. If you want to create a new component that uses a Rectangle but not a CUI-Component for whatever reason, you can use the following command to change the referenced component or create a new reference.

```
const internalRef = useRef<any>(null);

useEffect(() => {
    RefRegistry.updateReference(props.rect.className, props.rect.id, internalRef.current);

    return () => {
        RefRegistry.removeReference(props.rect.className, props.rect.id);
    }
}, [props.rect]);
```

Of course, there is more to RefRegistry than just a fancy debug tools, you can use create signals and send them from one component to another easily. To do so, create them like so

```
const internalRef = useRef<any>(null);

useImperativeHandle(internalRef, () => ({
    receiveSignal(signal: SignalObject) {
        switch (signal.key) {
            case 'signal1':
                doSomething(signal.value);
                //Do something
                break;
            default:
                break;
            }
        }
    }));

useEffect(() => {
    RefRegistry.updateReference(props.rect.className, props.rect.id, internalRef.current);

    return () => {
        RefRegistry.removeReference(props.rect.className, props.rect.id);
    }
}, [props.rect]);
```

You can then send signals using `sendSignalTo(signal: SignalObject, className: string, id?: number)` or `sendSignalToAll(signal: SignalObject) ` command to communicate to another CUI-Component easily where `SignalObject = { key: string; value?: any; }`.
