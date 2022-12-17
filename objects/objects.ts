export type Vec2 = {
    x: number,
    y: number
}
export const vecToString = (v: Vec2)=>{
    return `${v.x}, ${v.y}`;
}

export const vecToInt = (vec: Vec2)=>{
    return vec.y * 1e3 + vec.x;
}

export const intToVec = (i: number) => {
    return {
        y: Math.floor(i / 1e3),
        x: i % 1e3
    }
}