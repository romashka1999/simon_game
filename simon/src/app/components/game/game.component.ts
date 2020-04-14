import { Component, OnInit } from '@angular/core';
import { GameStateService } from 'src/app/services/game-state.service';
import { sleep } from 'src/app/helpers/helper';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  count: number;
  colors: any = {
    red: false,
    blue: false,
    green: false,
    yellow: false
  }

  constructor(private readonly gameStateService: GameStateService) { }

  ngOnInit() {
    this.gameStateService.state.subscribe(state => {
      console.log(state);
      if (this.count !== state.count) {
        this.count = state.count;
        this.teasePlayer(state.simon);
      }
    });
  }

  async onPlayerGuess(color: string) {
    this.gameStateService.playerGuess(color);
    if(this.count === this.gameStateService.count) {
      await sleep(500);
    }
  }

  async teasePlayer(simon: string[]) {
    for (let i = 0; i < simon.length; i++) {
      this.colors[simon[i]] = true;
      await sleep(1000);
      this.colors[simon[i]] = false;
      await sleep(500);
    }
  }

  async onStartGame() {
    await sleep(200);
    this.gameStateService.generateSimon();
  }

}
