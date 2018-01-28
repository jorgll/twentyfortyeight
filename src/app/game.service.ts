import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { LoggerService } from './logger.service';
import { Tile } from './tile.model';
import { empty } from 'rxjs/Observer';

@Injectable()
export class GameService {
  board: Tile[][];  
  boardSize: number = 4; // NxN
  tileCount = 0;
  testOverride = false;

  constructor(private logger: LoggerService) {}

  startNewGame(): Tile[][] {

    if (this.testOverride) {
      this.initializeTestBoard();
    } else {
      this.initializeEmptyBoard();
      this.seedInitialValues();
    }

    console.log('*******************************************************************');
    console.log('Initial board state set up');
    this.logger.logState(this.board);

    return this.board;
  }

  initializeEmptyBoard()
  {
    this.board = [];
    for (let i = 0; i < this.boardSize; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.boardSize; j++) {
        this.board[i][j] = new Tile (i, j, 0);
      }
    }
  }

  seedInitialValues()
  {
    const maxInitialTileCount: number = 4;

    for (let i = 0; i < maxInitialTileCount; i++) {
      this.addTile();
    }
  }

  // Method guarantees it will add a single tile.
  // It will keep trying until it does.
  addTile() {
    if (this.hasLost()) {
      console.log('You lose');
      return;
    }

    let value: number = 2
    let emptySpot = this.findEmptySpot();
    this.placeTile(new Tile(emptySpot.row, emptySpot.column, value));
  }

  hasLost(): boolean {
      // Check for lose condition
      if (this.tileCount >= this.boardSize * this.boardSize) {
        return true;
      }
      return false;
  }

  findEmptySpot(): Tile {
    let emptySpot = new Tile(0, 0);

    do {
      emptySpot.row = _.random(this.boardSize - 1);
      emptySpot.column = _.random(this.boardSize - 1);
    } while (this.board[emptySpot.row][emptySpot.column].value !== 0);
    
    return emptySpot;
  }

  placeTile(t: Tile) {
    console.log('Adding tile ' + t.value + ' at [' + t.row + ', ' + t.column + ']');
    this.board[t.row][t.column].value = t.value;
    this.tileCount++;
    this.logger.logState(this.board);
  }

  moveTile(from: Tile, to: Tile) {
    this.board[from.row][from.column].value = 0;
    this.board[to.row][to.column].value = from.value;
    console.log('Moving tile ' + from.value + ' from [' + from.row + ', ' + from.column + '] to ' + '[' + to.row + ', ' + to.column + ']');
  }

  combineTiles(from: Tile, to: Tile) {
    this.board[from.row][from.column].value = 0;
    this.board[to.row][to.column].value = from.value + from.value;
    this.tileCount--;
    console.log('*******************************************************************');
    console.log('Combining tiles ' + from.value + ' at [' + from.row + ', ' + from.column + '] with [' + to.row + ', ' + to.column + ']');
    this.logger.logState(this.board);
  }

  moveUp(): void {
    console.log('***** moveUp *****');
    this.logger.logState(this.board);
    let moveCount: number = 0;

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        let currentValue = this.board[i][j].value;
        if (currentValue !== 0) {
          for (let k = i - 1; k >= 0; k--) {
            if (this.board[k][j].value === currentValue) {
              this.combineTiles(new Tile(k + 1, j, currentValue), new Tile (k, j));
              moveCount++;
            } else if (this.board[k][j].value === 0) {
              this.moveTile(new Tile(k + 1, j, currentValue), new Tile(k, j));
              moveCount++;
            }
            currentValue = this.board[k][j].value;            
          }
        }
      }
    }
    if (moveCount > 0) {
      console.log('moveCount: ' + moveCount);
      this.logger.logState(this.board);
      this.addTile();
    }
  }

  moveDown(): void {
    console.log('***** moveDown *****');
    this.logger.logState(this.board);
    let moveCount: number = 0;
    for (let i = this.boardSize - 1; i >= 0; i--) {
      for (let j = this.boardSize - 1; j >= 0; j--) {
        let currentValue = this.board[i][j].value;
        if (currentValue !== 0) {
          for (let k = i + 1; k < this.boardSize; k++) {
            if (this.board[k][j].value === currentValue) {
              this.combineTiles(new Tile(k - 1, j, currentValue), new Tile(k, j));
              moveCount++;
            } else if (this.board[k][j].value === 0) {
              this.moveTile(new Tile(k - 1, j, currentValue), new Tile(k, j));
              moveCount++;
            }
            currentValue = this.board[k][j].value;
          }
        }
      }
    }
    if (moveCount > 0) {
      console.log('moveCount: ' + moveCount);
      this.logger.logState(this.board);
      this.addTile();
    }
  }

  moveLeft(): void {
    console.log('***** moveLeft *****');
    this.logger.logState(this.board);
    let moveCount: number = 0;
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        let currentValue = this.board[i][j].value;
        if (currentValue !== 0) {
          for (let k = j - 1; k >= 0; k--) {
            if (this.board[i][k].value === currentValue) {
              this.combineTiles(new Tile(i, k + 1, currentValue), new Tile(i, k));
              moveCount++;
            } else if (this.board[i][k].value === 0) {
              this.moveTile(new Tile(i, k + 1, currentValue), new Tile(i, k));
              moveCount++;
            }
            currentValue = this.board[i][k].value;
          }
        }
      }
    }
    if (moveCount > 0) {
      console.log('moveCount: ' + moveCount);
      this.logger.logState(this.board);
      this.addTile();
    }
  }

  moveRight(): void {
    console.log('***** moveRight *****');
    this.logger.logState(this.board);
    let moveCount: number = 0;
    for (let i = this.boardSize - 1; i >= 0; i--) {
      for (let j = this.boardSize - 1; j >= 0; j--) {
        let currentValue = this.board[i][j].value;
        if (currentValue !== 0) {
          for (let k = j + 1; k < this.boardSize; k++) {
            if (this.board[i][k].value === currentValue) {
              this.combineTiles(new Tile(i, k - 1, currentValue), new Tile(i, k));
              moveCount++;
            } else if (this.board[i][k].value === 0) {
              this.moveTile(new Tile(i, k - 1, currentValue), new Tile(i, k));
              moveCount++;
            }
            currentValue = this.board[i][k].value;
          }
        }
      }
    }
    if (moveCount > 0) {
      console.log('moveCount: ' + moveCount);
      this.logger.logState(this.board);
      this.addTile();
    }    
  }

  // Used to force a test case for debug purposes
  // Set testOverride = true to get the board to read this config
  initializeTestBoard(): void {
    this.initializeEmptyBoard();

    this.board[2][3].value = 2;
    this.board[3][1].value = 4;
    this.board[3][2].value = 32;
    this.board[3][3].value = 4;
  }

}
