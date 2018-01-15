import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class GameService {
  boardState: number[][];
  boardSize: number = 4; // NxN

  constructor() {}

  startNewGame(): number[][] {
    const maxInitialPower: number = 3; // Used for 2^N calculations
    const maxInitialTiles: number = 5;
    let numbers: number[][];

    // Initialize an empty board
    numbers = _.range(this.boardSize).map(() => {
      return _.range(this.boardSize).map(() => {
        return 0;
      });
    });

    // Seed initial values
    for (let i = 0; i < maxInitialTiles; i++) {
      let value = Math.pow(2, _.random(maxInitialPower));
      let row = _.random(this.boardSize - 1);
      let column = _.random(this.boardSize - 1);
      if (value > 1) {
        numbers[row][column] = value;
      }
      console.log('i: ' + i + ', row: ' + row + ', column: ' + column + ', value: ' + value);
    }

    this.boardState = numbers;
    return numbers;
  }

  moveUp(): void {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        let currentValue = this.boardState[i][j];
        for (let k = i - 1; k >= 0; k--) {
          if (this.boardState[k][j] === 0) {
            // Current space is empty, move forward
            this.boardState[k + 1][j] = 0;
            this.boardState[k][j] = currentValue;
          } else if (this.boardState[k][j] === currentValue) {
            // Current space has a matching tile, combine them
            this.boardState[k + 1][j] = 0;
            this.boardState[k][j] = currentValue + currentValue;
          }
          // No match and no room to move forward, skip
        }
      }
    }
  }

  moveDown(): void {
    for (let i = this.boardSize - 1; i >= 0; i--) {
      for (let j = this.boardSize - 1; j >= 0; j--) {
        let currentValue = this.boardState[i][j];
        for (let k = i + 1; k < this.boardSize; k++) {
          if (this.boardState[k][j] === 0) {
            // Current space is empty, move forward
            this.boardState[k - 1][j] = 0;
            this.boardState[k][j] = currentValue;
          } else if (this.boardState[k][j] === currentValue) {
            // Current space has a matching tile, combine them
            this.boardState[k - 1][j] = 0;
            this.boardState[k][j] = currentValue + currentValue;
          }
          // No match and no room to move forward, skip
        }
      }
    }    
  }

  moveLeft(): void {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        let currentValue = this.boardState[i][j];
        for (let k = j - 1; k >= 0; k--) {
          if (this.boardState[i][k] === 0) {
            // Current space is empty, move forward
            this.boardState[i][k + 1] = 0;
            this.boardState[i][k] = currentValue;
          } else if (this.boardState[i][k] === currentValue) {
            // Current space has a matching tile, combine them
            this.boardState[i][k + 1] = 0;
            this.boardState[i][k] = currentValue + currentValue;
          }
          // No match and no room to move forward, skip
        }
      }
    }
  }

  moveRight(): void {
    for (let i = this.boardSize - 1; i >= 0; i--) {
      for (let j = this.boardSize - 1; j >= 0; j--) {
        let currentValue = this.boardState[i][j];
        for (let k = j + 1; k < this.boardSize; k++) {
          if (this.boardState[i][k] === 0) {
            // Current space is empty, move forward
            this.boardState[i][k - 1] = 0;
            this.boardState[i][k] = currentValue;
          } else if (this.boardState[i][k] === currentValue) {
            // Current space has a matching tile, combine them
            this.boardState[i][k - 1] = 0;
            this.boardState[i][k] = currentValue + currentValue;
          }
          // No match and no room to move forward, skip
        }
      }
    }
  }

}
