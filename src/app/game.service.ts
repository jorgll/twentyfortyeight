import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { LoggerService } from './logger.service';
import { Tile } from './tile.model';

enum Direction {
  up,   // 0
  down, // 1
  left, // 2
  right // 3
}

@Injectable()
export class GameService {
  board: Tile[][];
  boardSize = 4; // NxN
  tileCount = 0;
  testMode = false;
  maxInitialTileCount = 4;
  Direction = Direction;

  constructor(private logger: LoggerService) {}

  startNewGame(): Tile[][] {

    this.initializeEmptyBoard();
    if (this.testMode) {
      this.initializeTestBoard();
    } else {
      this.seedInitialValues();
    }

    console.log('*******************************************************************');
    console.log('Initial board state set up');
    this.logger.logState(this.board);

    return this.board;
  }

  initializeEmptyBoard() {
    this.board = [];
    for (let i = 0; i < this.boardSize; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.boardSize; j++) {
        this.board[i][j] = new Tile (i, j, 0);
      }
    }
  }

  seedInitialValues() {
    for (let i = 0; i < this.maxInitialTileCount; i++) {
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

    const value = 2;
    const emptySpot = this.findEmptySpot();
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
    const emptySpot = new Tile(0, 0);

    do {
      emptySpot.row = _.random(this.boardSize - 1);
      emptySpot.column = _.random(this.boardSize - 1);
    } while (this.board[emptySpot.row][emptySpot.column].value !== 0);
    return emptySpot;
  }

  placeTile(t: Tile): void {
    console.log('    Adding tile ', t);
    this.board[t.row][t.column].value = t.value;
    this.tileCount++;
  }

  moveTile(from: Tile, to: Tile): void {
    console.log('    Moving tile ', from, to);
    to.value = from.value;
    from.value = 0;
  }

  combineTiles(from: Tile, to: Tile): void {
    console.log('    Combining to make new tile ', from, to);
    to.value = from.value + from.value;
    from.value = 0;
    to.merged = true;
    this.tileCount--;
    this.logger.logState(this.board);
  }

  moveOneStep(current: Tile, direction: Direction): Tile {
    let result: Tile = null;
    switch (direction) {
      case Direction.up:
        if (this.isValidTile(current, -1, 0)) {
          result = this.board[current.row - 1][current.column];
        }
        break;
      case Direction.down:
        if (this.isValidTile(current, +1, 0)) {
          result = this.board[current.row + 1][current.column];
        }
        break;
      case Direction.left:
        if (this.isValidTile(current, 0, -1)) {
          result = this.board[current.row][current.column - 1];
        }
        break;
      case Direction.right:
        if (this.isValidTile(current, 0, +1)) {
          result = this.board[current.row][current.column + 1];
        }
        break;
      default:
        break;
    }
    if (result) {
      console.log('    moveOneStep, direction: ' + direction);
    }
    return result;
  }

  isValidTile(tile: Tile, rowDelta?: number, columnDelta?: number): boolean {
    if (!tile) {
      return false;
    }

    const max: number = this.boardSize - 1;
    const min = 0;
    const newRow = rowDelta ? tile.row + rowDelta : tile.row;
    const newColumn = columnDelta ? tile.column + columnDelta : tile.column;
    const isValid: boolean = (newRow >= min && newRow <= max && newColumn >= min && newColumn <= max);
    return isValid;
  }

  isTileAvailable(tile: Tile): boolean {
    return tile.value === 0;
  }

  isTileAtEdgeOfBoard(tile: Tile): boolean {
    return (
      tile.column === 0 || tile.column === this.boardSize - 1 ||
      tile.row === 0 || tile.row === this.boardSize - 1);
  }

  resetTiles(): void {
    for (const row of this.board) {
      row.forEach(tile => tile.merged = false);
    }
  }

  // Takes a single tile on the board and a direction, finds the next spot to move the tile to
  //
  // tile can return:
  // 1. The next non-empty tile in the direction specified
  // 2. The board edge if there are no more tiles in that direction
  // 3. null if the current tile is already at the board edge
  //
  // lastEmptyPosition returns the last valid empty position before the next
  getNextPosition(tile: Tile, direction: Direction): { lastEmptyPosition: Tile, tile: Tile } {
    let current: Tile = tile;
    let previous: Tile = tile;
    do {
      previous = current;
      current = this.moveOneStep(current, direction);
    } while (this.isValidTile(current) && this.isTileAvailable(current));

    if (current === tile) {
      current = null;
    }

    if (current) {
      console.log('    getNextTile. Direction: ' + direction, tile, current);
    }
    return {
      lastEmptyPosition: previous,
      tile: current
    };
  }

    // Get rows vs. columns of tiles to process
    getTileGroups(direction: Direction): Tile[][] {
    let tileGroups: Tile[][];
    if (direction === Direction.up || direction === Direction.down) {
      tileGroups = _.unzip(this.board);
    } else {
      tileGroups = this.board;
    }
    return tileGroups;
  }

  // Main move method
  // Interprets a user move up/down/left/right command
  move(direction: Direction): void {
    console.log('\r\n');
    console.log('***** move ' + direction + ' *****');
    this.logger.logState(this.board);
    let foundMove = false;

    const tileGroups: Tile[][] = this.getTileGroups(direction);
    for (const tileGroup of tileGroups) {
      const tilesToEvaluate: Tile[] = tileGroup.filter(tile => !this.isTileAvailable(tile));
      if (direction === Direction.right || direction === Direction.down) {
        console.log('Direction was right/up - inverting order of tiles to process');
        tilesToEvaluate.reverse();
      }
      tilesToEvaluate.forEach(current => {
        console.log('Processing: ', current);
        const next = this.getNextPosition(current, direction);
        if (next.tile && next.tile !== current && current.value === next.tile.value && !next.tile.merged) {
          this.combineTiles(current, next.tile);
          foundMove = true;
        } else if (next && next.tile !== current && this.isTileAvailable(next.lastEmptyPosition)) {
          console.log('    Moving to last empty spot');
          this.moveTile(current, next.lastEmptyPosition);
          foundMove = true;
        } else {
          console.log('    Nothing to do for tile', current);
        }
      });
    }

    if (foundMove && !this.testMode) {
      console.log('foundMove = true. New state:');
      this.logger.logState(this.board);
      this.addTile();
    }
    this.resetTiles();
  }

  // Used to force a test case for debug purposes
  // Set testMode = true to get the board to read this config
  initializeTestBoard(): void {
    this.board[0][1].value = 2;
    this.board[0][2].value = 2;
    this.board[0][3].value = 2;
    this.board[1][3].value = 8;
  }
}
