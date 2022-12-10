import * as fs from 'fs'

export const pt1 = (f: string) => {
    var lines = fs.readFileSync(f).toString().split("\n");

    let count = 0;
    for (let i = 0; i < lines[0].length; i++) {
        for (let j = 0; j < lines.length; j++) {
            const item = Number(lines[i][j]);

            if (i === 0 || j === 0 || i === lines.length - 1 || j === lines[0].length - 1) {
                count++;
                continue;
            }
            let clears1 = true;
            let clears2 = true;
            let clears3 = true;
            let clears4 = true;

            for (let k = 0; k < i; k++) {
                if (item <= Number(lines[k][j])) {
                    clears1 = false;
                    break;
                }
            }

            for (let k = i + 1; k < lines.length; k++) {
                if (item <= Number(lines[k][j])) {
                    clears2 = false;
                    break;
                }
            }

            for (let k = 0; k < j; k++) {
                if (item <= Number(lines[i][k])) {
                    clears3 = false;
                    break;
                }
            }

            for (let k = j + 1; k < lines[0].length; k++) {
                if (item <= Number(lines[i][k])) {
                    clears4 = false;
                    break;
                }
            }

            if (clears1 || clears2 || clears3 || clears4) {
                count++;
            }
        }
    }
    return count;
}

export const pt2 = (f: string) => {
    var lines = fs.readFileSync(f).toString().split("\n");
    let max = 0;
    for (let i = 0; i < lines[0].length; i++) {
        for (let j = 0; j < lines.length; j++) {
            const item = Number(lines[i][j]);

            let count1 = 0;
            let count2 = 0;
            let count3 = 0;
            let count4 = 0;

            if (j !== 0) {
                count1 = j;
                for (let k = j - 1; k >= 0; k--) {
                    if (item <= Number(lines[i][k])) {
                        count1 = j - k;
                        break;
                    }
                }
            }
            else count1 = 0;

            if (j !== lines[0].length - 1) {
                count2 = lines.length - 1 - j;
                for (let k = j + 1; k < lines.length; k++) {
                    if (item <= Number(lines[i][k])) {
                        count2 = k - j;
                        break;
                    }
                }
            }
            else count2 = 0;

            if (i !== 0) {
                count3 = i;
                for (let k = i - 1; k >= 0; k--) {
                    if (item <= Number(lines[k][j])) {
                        count3 = i - k;
                        break;
                    }
                }
            }
            else count3 = 0;

            if (i !== lines.length - 1) {
                count4 = lines.length - 1 - i;
                for (let k = i + 1; k < lines[0].length; k++) {
                    if (item <= Number(lines[k][j])) {
                        count4 = k - i;
                        break;
                    }
                }
            }
            else count4 = 0;

            let sum = count4 * count3 * count2 * count1;
            if (sum > max) {
                max = sum;
            }
        }
    }
    return max;
}