import { Component, HostListener, OnInit } from '@angular/core';
import { GameService } from './game.service';
import * as _ from 'lodash';
import { Tile } from './tile.model';
 
@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  tiles: Tile[][];

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    console.log('lodash version: ', _.VERSION);
    this.tiles = this.gameService.startNewGame();
  }

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    switch (event.keyCode) {
    case 32:
        console.log('Space (Add tile)');
        this.gameService.addTile();
        break;
      case 38:
        this.gameService.moveUp();
        break;
      case 40:
        this.gameService.moveDown();
        break;
      case 37:
        this.gameService.moveLeft();
        break;
      case 39:
        this.gameService.moveRight();
        break;
      default:
        // Ignore all other inputs
        break;
    }
  }
}
