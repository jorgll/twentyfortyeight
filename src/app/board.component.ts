import { Component, HostListener, OnInit } from '@angular/core';
import { GameService } from './game.service';
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
        this.gameService.move(this.gameService.Direction.up);
        break;
      case 40:
        this.gameService.move(this.gameService.Direction.down);
        break;
      case 37:
        this.gameService.move(this.gameService.Direction.left);
        break;
      case 39:
        this.gameService.move(this.gameService.Direction.right);
        break;
      default:
        // Ignore all other inputs
        break;
    }
  }
}
