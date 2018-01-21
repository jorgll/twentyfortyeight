import { Component, HostListener, OnInit } from '@angular/core';
import { GameService } from './game.service';
import * as _ from 'lodash';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  rows: number[][];

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    console.log('lodash version: ', _.VERSION);
    this.rows = this.gameService.startNewGame();
  }

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    switch (event.keyCode) {
    case 32:
        console.log('Space (Add tile)');
        this.gameService.addTile();
        break;
      case 38:
        console.log('Move up');
        this.gameService.moveUp();
        break;
      case 40:
        console.log('Move down');
        this.gameService.moveDown();
        break;
      case 37:
        console.log('Move left');
        this.gameService.moveLeft();
        break;
      case 39:
        console.log('Move right');
        this.gameService.moveRight();
        break;
      default:
        // Ignore all other inputs
        break;
    }
  }
}
