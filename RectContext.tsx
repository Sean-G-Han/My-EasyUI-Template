import React from "react";
import { AnimNum, Rectangle, XYWH } from "./geometry";

// x and y represent the global cumulative offset
type RectOrigin = {x: AnimNum, y: AnimNum, parent?: Rectangle}; 

const RectContext = React.createContext<RectOrigin>({x: 0, y: 0, parent: undefined});

export const RectProvider = RectContext.Provider;

export default RectContext;