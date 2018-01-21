import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BoardComponent } from './board.component';
import { LoggerService } from './logger.service';
import { GameService } from './game.service';

@NgModule({
  declarations: [AppComponent, BoardComponent],
  imports: [BrowserModule],
  providers: [GameService, LoggerService],
  bootstrap: [AppComponent]
})
export class AppModule {}
