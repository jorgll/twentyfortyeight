import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {

  constructor() {}

  logState(board: number[][]): void {
    console.log(
      '[[' +
        board[0][0] +
        '][' +
        board[0][1] +
        '][' +
        board[0][2] +
        '][' +
        board[0][3] +
        '],'
    );
    console.log(
      '[[' +
        board[1][0] +
        '][' +
        board[1][1] +
        '][' +
        board[1][2] +
        '][' +
        board[1][3] +
        '],'
    );
    console.log(
      '[[' +
        board[2][0] +
        '][' +
        board[2][1] +
        '][' +
        board[2][2] +
        '][' +
        board[2][3] +
        '],'
    );
    console.log(
      '[[' +
        board[3][0] +
        '][' +
        board[3][1] +
        '][' +
        board[3][2] +
        '][' +
        board[3][3] +
        ']]'
    );    
  }
}