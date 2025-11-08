# CommonUI Template

A lightweight **React Native UI template** for building layouts using **constraints**, similar to Autodesk-style layout programs. Components are positioned and sized using **`Rect`** objects and a **constraint-based system**, allowing flexible and precise UI placement.

## Table of Contents
- [Features](#Features)
- [Introduction](#Introduction)
- [Usage](#Usage)
    - [Rect System](#Rect)
    - [CUIAbsoluteBox](#CUIAbsoluteBox)
    - [CUIRelativeBox](#CUIRelativeBox)

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

## AbsoluteBox

AbsoluteBoxes is the main way to structure the code. It takes in a Rect object as a parameter and renders it as an `Animated.View` component. As such, you can add other child components as you would a regular `View` component.

```
<CUIAbsoluteBox rect={root}>
    <Button/>
</CUIAbsoluteBox>
```

## RelativeBox

RelativeBoxes are a way to add repeated and/or dynamic components inside an AbsoluteBox.
