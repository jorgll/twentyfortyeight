import { Injectable, NgZone } from '@angular/core';
import * as _ from 'lodash';
import { setTimeout } from 'timers';

@Injectable()
export class GameService {
  boardState: number[][];
  boardSize: number = 4; // NxN
  maxTile: number = 0;

  constructor(public zone: NgZone) {}

  logBoard(): void {
    console.log(
      '[[' +
        this.boardState[0][0] +
        '][' +
        this.boardState[0][1] +
        '][' +
        this.boardState[0][2] +
        '][' +
        this.boardState[0][3] +
        '],'
    );
    console.log(
      '[[' +
        this.boardState[1][0] +
        '][' +
        this.boardState[1][1] +
        '][' +
        this.boardState[1][2] +
        '][' +
        this.boardState[1][3] +
        '],'
    );
    console.log(
      '[[' +
        this.boardState[2][0] +
        '][' +
        this.boardState[2][1] +
        '][' +
        this.boardState[2][2] +
        '][' +
        this.boardState[2][3] +
        '],'
    );
    console.log(
      '[[' +
        this.boardState[3][0] +
        '][' +
        this.boardState[3][1] +
        '][' +
        this.boardState[3][2] +
        '][' +
        this.boardState[3][3] +
        ']]'
    );
  }

  startNewGame(): number[][] {
    const maxInitialTileValue: number = 8;
    const maxInitialTileCount: number = 4;

    // Initialize an empty board
    this.boardState = _.range(this.boardSize).map(() => {
      return _.range(this.boardSize).map(() => {
        return 0;
      });
    });

    // Seed initial values
    for (let i = 0; i < maxInitialTileCount; i++) {
      this.addTile(maxInitialTileValue);
    }

    return this.boardState;
  }

  // Method guarantees it will add a single tile
  // If will keep trying until it does
  addTile(max?: number) {
    // Get the 'pow' in 2^pow
    let pow: number;
    if (max) {
      pow = Math.log(max) / Math.LN2;
    } else {
      pow = Math.log(this.maxTile) / Math.LN2;
    }
    if (pow < 2) {
      pow = 2;
    }

    // Get the corresponding value
    let value: number = 1;
    while (value <= 1) {
      value = Math.pow(2, _.random(pow));
    }

    // Find a spot on the board to add it
    let row = _.random(this.boardSize - 1);
    let column = _.random(this.boardSize - 1);
    if (this.boardState[row][column] === 0) {
      // Add it
      this.boardState[row][column] = value;
      console.log('Adding tile ' + value + ' at [' + row + ', ' + column + ']');
      if (value > this.maxTile) {
        this.maxTile = value;
        console.log('New maxTile: ' + this.maxTile);
      }
      this.logBoard();
    } else {
      // Collision in randomly-generated tile. Try again.
      this.addTile(max);
    }
  }

  moveTile(x1: number, y1: number, x2: number, y2: number, value: number) {
    this.boardState[x1][y1] = 0;
    this.boardState[x2][y2] = value;
    console.log('Moving tile ' + value + ' at [' + x1 + ', ' + y1 + '] to ' + '[' + x2 + ', ' + y2 + ']');
  }

  combineTiles(x1: number, y1: number, x2: number, y2: number, value: number) {
    if (value * 2 > this.maxTile) {
      this.maxTile = value * 2;
      console.log('New maxTile: ' + this.maxTile);
    }
    this.boardState[x1][y1] = 0;
    this.boardState[x2][y2] = value * 2;
    console.log('Consolidating tiles ' + value + ' at [' + x1 + ', ' + y1 + '] and ' + '[' + x2 + ', ' + y2 + ']');
  }

  moveUp(): void {
    let foundValidMove: boolean = false;
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        let currentValue = this.boardState[i][j];
        for (let k = i - 1; k >= 0; k--) {
          if (currentValue === 0) {
            continue;
          }
          if (this.boardState[k][j] === 0) {
            // Current space is empty, move forward
            this.moveTile(k + 1, j, k, j, currentValue);
            foundValidMove = true;
          } else if (this.boardState[k][j] === currentValue) {
            // Current space has a matching tile, combine them
            this.combineTiles(k + 1, j, k, j, currentValue);
            foundValidMove = true;
          } else {
            // No match and no room to move forward, skip
            console.log('No pairs found and no spaces moved. Skipping.');
          }
        }
      }
    }
    if (foundValidMove) {
      this.addTile();
    }
  }

  moveDown(): void {
    let foundValidMove: boolean = true;
    for (let i = this.boardSize - 1; i >= 0; i--) {
      for (let j = this.boardSize - 1; j >= 0; j--) {
        let currentValue = this.boardState[i][j];
        for (let k = i + 1; k < this.boardSize; k++) {
          if (currentValue === 0) {
            continue;
          }
          if (this.boardState[k][j] === 0) {
            // Current space is empty, move forward
            this.moveTile(k - 1, j, k, j, currentValue);
          } else if (this.boardState[k][j] === currentValue) {
            // Current space has a matching tile, combine them
            this.combineTiles(k - 1, j, k, j, currentValue);
          } else {
            // No match and no room to move forward, skip
            console.log('No pairs found and no spaces moved. Skipping.');
            foundValidMove = false;
          }
        }
      }
    }
    if (foundValidMove) {
      this.addTile();
    }
  }

  moveLeft(): void {
    let foundValidMove: boolean = true;
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        let currentValue = this.boardState[i][j];
        for (let k = j - 1; k >= 0; k--) {
          if (currentValue === 0) {
            continue;
          }
          if (this.boardState[i][k] === 0) {
            // Current space is empty, move forward
            this.moveTile(i, k + 1, i, k, currentValue);
          } else if (this.boardState[i][k] === currentValue) {
            // Current space has a matching tile, combine them
            this.combineTiles(i, k + 1, i, k, currentValue);
          } else {
            // No match and no room to move forward, skip
            console.log('No pairs found and no spaces moved. Skipping.');
            foundValidMove = false;
          }
        }
      }
    }
    if (foundValidMove) {
      this.addTile();
    }
  }

  moveRight(): void {
    let foundValidMove: boolean = true;
    for (let i = this.boardSize - 1; i >= 0; i--) {
      for (let j = this.boardSize - 1; j >= 0; j--) {
        let currentValue = this.boardState[i][j];
        for (let k = j + 1; k < this.boardSize; k++) {
          if (currentValue === 0) {
            continue;
          }
          if (this.boardState[i][k] === 0) {
            // Current space is empty, move forward
            this.moveTile(i, k - 1, i, k, currentValue);
          } else if (this.boardState[i][k] === currentValue) {
            // Current space has a matching tile, combine them
            this.combineTiles(i, k - 1, i, k, currentValue);
          } else {
            // No match and no room to move forward, skip
            console.log('No pairs found and no spaces moved. Skipping.');
            foundValidMove = false;
          }
        }
      }
    }
    if (foundValidMove) {
      this.addTile();
    }
  }
}
