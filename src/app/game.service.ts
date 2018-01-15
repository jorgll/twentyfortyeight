import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class GameService {
  boardState: number[][];
  boardSize: number[] = [0, 1, 2, 3];

  constructor() {}

  startNewGame(): number[][] {
    const maxInitialPower: number = 3; // Used for 2^N calculations
    const maxInitialTiles: number = 5;
    let numbers: number[][];

    // Initialize an empty board
    numbers = _.range(this.boardSize.length).map(() => {
      return _.range(this.boardSize.length).map(() => {
        return 0;
      });
    });

    // Seed initial values
    for (let i = 0; i < maxInitialTiles; i++) {
      let value = Math.pow(2, _.random(maxInitialPower));
      let row = _.random(this.boardSize.length - 1);
      let column = _.random(this.boardSize.length - 1);
      if (value > 1) {
        numbers[row][column] = value;
      }
      console.log('i: ' + i + ', row: ' + row + ', column: ' + column + ', value: ' + value);
    }

    return numbers;
  }
}
