import React from "react";

type RectOrigin = {x: number, y: number};

const RectContext = React.createContext<RectOrigin>({x: 0, y: 0});

export const RectProvider = RectContext.Provider;

export default RectContext;