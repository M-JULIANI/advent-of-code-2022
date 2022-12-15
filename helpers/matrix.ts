export const makeMatrix = <T>(m: T, n: T, value: T | (() => T)) => {
    const out = [] as T[][];
    for (let j = 0; j < n; ++j) {
      out[j] = [];
      for (let i = 0; i < m; ++i) {
        // @ts-ignore
        out[j][i] = value && value.apply ? value(i, j) : value;
      }
    }
    return out;
  }

  export const makeMatrixS = (m: number, n: number, value: string) => {
    const out = [] as string[][];
    for (let j = 0; j < n; ++j) {
      out[j] = [];
      for (let i = 0; i < m; ++i) {
        // @ts-ignore
        out[j][i] = value;
      }
    }
    return out;
  }