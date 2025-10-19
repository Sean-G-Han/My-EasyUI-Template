# CommonUI Template

A lightweight **React Native UI template** for building layouts using **constraints**, similar to Autodesk-style layout programs. Components are positioned and sized using **`Rectangle`** objects and a **constraint-based system**, allowing flexible and precise UI placement.

---

## Features

- **Constraint-based layout**: Attach UI elements relative to parent rectangles or other elements.  
- **Rectangle abstraction**: Each UI element is represented as a `Rectangle`, making size, position, and growth behavior explicit.  
- **Composable UI components**: Easily wrap and position children in `CommonUIRect` or custom layout components like `CommonUISideBar`.  
- **React context-based**: Automatic propagation of layout context via `RectContext` for nested components.  

---

## Getting Started

### 1. Add as a Git submodule

If you want to use only the library (without the full project), you can add the `library-only` branch as a submodule in your own project:

```bash
git submodule add -b library-only https://github.com/Sean-G-Han/project-a.git path/to/library
git submodule update --init --recursive
```
### 2. Import Components
`import { CommonUIRect, CommonUISideBar } from 'EasyUI/CommonUI/[COMPONENT_NAME]';`

Use them in your JSX like any other React Native component:
```
    const window = useWindowDimensions();
    const root = Rectangle.create({
        size: {width: window.width, height: window.height},
        pos: {x: 0, y: 0},
    });

    const child = Rectangle.create({
        size: { width: 50, height: 50 },
        rectCorners: [[root, "bottom-right"]],
        refCorner: "bottom-right",
    });

    const child2 = Rectangle.create({
        size: { width: 50, height: 50 },
        rectCorners: [[root, "top-left"]],
        refCorner: "top-left",
    });

    const child3 = Rectangle.create({
        rectSides: [[child, "left"], [child2, "right"], [child2, "bottom"], [child, "top"]],
    });

    return (
        <>
        <CommonUIRect rect={root}>
          <CommonUIRect rect={child} />
          <CommonUIRect rect={child2} />
          <CommonUIRect rect={child3} />
        </CommonUIRect>
        </>
    );
```

### 3. Using Rectangles & Constraints

Define a rectangle:
```
const myRect = Rectangle.create({
  rectSides: [[parentRect, "top"]],
  growDirection: "down",
  growSize: 200
});
```


Wrap your content in CommonUIRect:
```
<CommonUIRect rect={myRect}>
  <Text>Hello, World!</Text>
</CommonUIRect>
```

### 4. Updating the Library Submodule

If the library code in library-only is updated, pull the latest changes in your project:

`git submodule update --remote --merge`

5. Why library-only Branch Exists

Git submodules always clone entire repositories, not individual folders.

You could technically use the full repo as a submodule, but library-only keeps it clean and package-like.
