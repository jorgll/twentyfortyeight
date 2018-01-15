import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class GameService {

  boardState: number[][];
  boardSize: number[] = [0, 1, 2, 3];

  constructor() { }

  startNewGame() { }

  getInitialBoardState(): number[][] {
    let numbers: number[][];

    // Initialize 2D board
    numbers = _.range(this.boardSize.length).map(() => {
      return _.range(this.boardSize.length).map(() => {
        return 0;
      });
    });

    // Assign starter values
    return numbers;
  }

  getNewBoardState() { }

}