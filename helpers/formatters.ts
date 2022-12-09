export const formatString = (x: string) => '' + x;
export const formatStringMatrix = (m: string[][]) => m.map((r: string[]) => r.map(formatString).join(' ')).join("\n");