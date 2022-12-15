export const formatString = (x: string) => '' + x.padStart(2, '0');
export const formatStringMatrix = (m: string[][]) => m.map((r: string[]) => r.map(formatString).join(' ')).join("\n");

export const formatNumber = (x: number) => '' + x;
export const formatNumberMatrix = (m: number[][]) => m.map((r: number[]) => r.map(formatNumber).join(' ')).join("\n");