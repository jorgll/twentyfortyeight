import { Injectable } from '@angular/core';
import { Tile } from './tile.model';

@Injectable()
export class LoggerService {

  constructor() {}

  logState(board: Tile[][]): void {
    console.log('[[' +
      board[0][0].value + '][' + board[0][1].value + '][' + board[0][2].value + '][' + board[0][3].value + ']]\r\n[[' +
      board[1][0].value + '][' + board[1][1].value + '][' + board[1][2].value + '][' + board[1][3].value + ']]\r\n[[' +
      board[2][0].value + '][' + board[2][1].value + '][' + board[2][2].value + '][' + board[2][3].value + ']]\r\n[[' +
      board[3][0].value + '][' + board[3][1].value + '][' + board[3][2].value + '][' + board[3][3].value + ']]');
  }
}
