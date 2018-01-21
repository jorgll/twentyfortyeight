import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { LoggerService } from './logger.service';

@Injectable()
export class GameService {
  boardState: number[][];
  boardSize: number = 4; // NxN
  tileCount = 0;
  testOverride = false;

  constructor(private logger: LoggerService) {}

  startNewGame(): number[][] {
    const maxInitialTileValue: number = 8;
    const maxInitialTileCount: number = 4;

    if (this.testOverride) {
      // Initialize test board
      this.boardState = this.initTestCase();
    } else {
      // Initialize an empty board
      this.boardState = _.range(this.boardSize).map(() => {
        return _.range(this.boardSize).map(() => {
          return 0;
        });
      });
      // Seed initial values
      for (let i = 0; i < maxInitialTileCount; i++) {
        this.addTile();
      }
    }

    console.log('*******************************************************************');
    console.log('Initial board state set up');
    console.log('*******************************************************************');
    this.logger.logState(this.boardState);
    return this.boardState;
  }

  // Method guarantees it will add a single tile
  // If will keep trying until it does
  addTile() {
    // Check for lose condition
    if (this.tileCount >= this.boardSize * this.boardSize) {
      console.log('You lose');
      return;
    }

    let value: number = 2

    // Find an empty spot on the board
    let row: number;
    let column: number;
    do {
      row = _.random(this.boardSize - 1);
      column = _.random(this.boardSize - 1);
    } while (this.boardState[row][column] !== 0);

    // Place tile
    console.log('Adding tile ' + value + ' at [' + row + ', ' + column + ']');
    this.boardState[row][column] = value;
    this.tileCount++;
    this.logger.logState(this.boardState);
  }

  moveTile(x1: number, y1: number, x2: number, y2: number, value: number) {
    this.boardState[x1][y1] = 0;
    this.boardState[x2][y2] = value;
    console.log('Moving tile ' + value + ' from [' + x1 + ', ' + y1 + '] to ' + '[' + x2 + ', ' + y2 + ']');
  }

  combineTiles(x1: number, y1: number, x2: number, y2: number, value: number) {
    this.boardState[x1][y1] = 0;
    this.boardState[x2][y2] = value + value;
    this.tileCount--;
    console.log('*******************************************************************');
    console.log('Combining tiles ' + value + ' at [' + x1 + ', ' + y1 + '] with [' + x2 + ', ' + y2 + ']');
    this.logger.logState(this.boardState);
    console.log('*******************************************************************');
  }

  moveUp(): void {
    console.log('***** moveUp *****');
    this.logger.logState(this.boardState);
    let moveCount: number = 0;
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        let currentValue = this.boardState[i][j];
        if (currentValue !== 0) {
          for (let k = i - 1; k >= 0; k--) {
            if (this.boardState[k][j] === currentValue) {
              this.combineTiles(k + 1, j, k, j, currentValue);
              moveCount++;
            } else if (this.boardState[k][j] === 0) {
              this.moveTile(k + 1, j, k, j, currentValue);
              moveCount++;
            }
            currentValue = this.boardState[k][j];            
          }
        }
      }
    }
    if (moveCount > 0) {
      console.log('moveCount: ' + moveCount);
      this.logger.logState(this.boardState);
      this.addTile();
    }
  }

  moveDown(): void {
    console.log('***** moveDown *****');
    this.logger.logState(this.boardState);
    let moveCount: number = 0;
    for (let i = this.boardSize - 1; i >= 0; i--) {
      for (let j = this.boardSize - 1; j >= 0; j--) {
        let currentValue = this.boardState[i][j];
        if (currentValue !== 0) {
          for (let k = i + 1; k < this.boardSize; k++) {
            if (this.boardState[k][j] === currentValue) {
              this.combineTiles(k - 1, j, k, j, currentValue);
              moveCount++;
            } else if (this.boardState[k][j] === 0) {
              this.moveTile(k - 1, j, k, j, currentValue);
              moveCount++;
            }
            currentValue = this.boardState[k][j];
          }
        }
      }
    }
    if (moveCount > 0) {
      console.log('moveCount: ' + moveCount);
      this.logger.logState(this.boardState);
      this.addTile();
    }
  }

  moveLeft(): void {
    console.log('***** moveLeft *****');
    this.logger.logState(this.boardState);
    let moveCount: number = 0;
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        let currentValue = this.boardState[i][j];
        if (currentValue !== 0) {
          for (let k = j - 1; k >= 0; k--) {
            if (this.boardState[i][k] === currentValue) {
              this.combineTiles(i, k + 1, i, k, currentValue);
              moveCount++;
            } else if (this.boardState[i][k] === 0) {
              this.moveTile(i, k + 1, i, k, currentValue);
              moveCount++;
            }
            currentValue = this.boardState[i][k];
          }
        }
      }
    }
    if (moveCount > 0) {
      console.log('moveCount: ' + moveCount);
      this.logger.logState(this.boardState);
      this.addTile();
    }
  }

  moveRight(): void {
    console.log('***** moveRight *****');
    this.logger.logState(this.boardState);
    let moveCount: number = 0;
    for (let i = this.boardSize - 1; i >= 0; i--) {
      for (let j = this.boardSize - 1; j >= 0; j--) {
        let currentValue = this.boardState[i][j];
        if (currentValue !== 0) {
          for (let k = j + 1; k < this.boardSize; k++) {
            if (this.boardState[i][k] === currentValue) {
              this.combineTiles(i, k - 1, i, k, currentValue);
              moveCount++;
            } else if (this.boardState[i][k] === 0) {
              this.moveTile(i, k - 1, i, k, currentValue);
              moveCount++;
            }
            currentValue = this.boardState[i][k];
          }
        }
      }
    }
    if (moveCount > 0) {
      console.log('moveCount: ' + moveCount);
      this.logger.logState(this.boardState);
      this.addTile();
    }    
  }

  // Used to force a test case for debug purposes
  // Set testOverride = true to get the board to read this config
  initTestCase(): number[][] {
    return [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 2], [0, 4, 32, 4]];
  }

}
