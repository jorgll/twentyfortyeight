import { Component, OnInit } from '@angular/core';
import { GameService } from './game.service';
import * as _ from 'lodash';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})

export class BoardComponent implements OnInit {

    rows: number[][];

    constructor(private gameService: GameService) { 
    }

    ngOnInit(): void {
    console.log('lodash version: ', _.VERSION);
    this.rows = this.gameService.getInitialBoardState();
  }

}
