/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Tobias Koppers @sokra
 */
export function getNumberOfLines(str: string) {
    let nr = -1;
    let idx = -1;
    do {
        nr++;
        idx = str.indexOf('\n', idx + 1);
    } while (idx >= 0);
    return nr;
}
