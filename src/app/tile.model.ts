export class Tile {
    row: number;
    column: number;
    value: number;
    merged: boolean;

    constructor(r: number, c: number, v?: number) {
        this.row = r;
        this.column = c;
        this.value = v || 0;
        this.merged = false;
    }
}
