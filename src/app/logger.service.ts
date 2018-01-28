import { Injectable } from '@angular/core';
import { Tile } from './tile.model';

@Injectable()
export class LoggerService {

  constructor() {}

  logState(board: Tile[][]): void {
    console.log(board);
  }
}