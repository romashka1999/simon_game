import { Component, OnInit } from '@angular/core';
import { GameStateService } from 'src/app/services/game-state.service';
import { sleep } from 'src/app/helpers/helper';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  playerMove: boolean = false;
  gameIsRunning: boolean= false;
  count: number;
  colors: any = {
    red: false,
    blue: false,
    green: false,
    yellow: false
  }

  sounds = {
    green: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
    red: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
    blue: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
    yellow: new Audio ("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
  };

  constructor(private readonly gameStateService: GameStateService) { }

  ngOnInit() {
    this.gameStateService.state.subscribe(state => {
      console.log(state);
      if(state.defeated && this.gameIsRunning) {
        this.count = 1;
        alert('you defeated try again');
        this.gameIsRunning = false;
        return
      }
      if (this.count !== state.count || state.count === 1) {
        this.playerMove = false;
        this.count = state.count;
        this.teasePlayer(state.simon);
      }
    });
  }

  async onPlayerGuess(color: string) {
    if(!this.playerMove){
      return;
    }
    this.sounds[color].play();
    this.gameStateService.playerGuess(color);
    if(this.gameStateService.player.length-1 === this.gameStateService.count){
      console.log('egaaaaaaaaaaaaaaaaaaaaaaaaa');
      await sleep(1000);
    }
  }

  async teasePlayer(simon: string[]) {
    for (let i = 0; i < simon.length; i++) {
      this.sounds[simon[i]].play();
      this.colors[simon[i]] = true;
      await sleep(1000);
      this.colors[simon[i]] = false;
      await sleep(500);
    }
    this.playerMove = true;
  }

  async onStartGame() {
    this.gameIsRunning = true;
    await sleep(200);
    this.gameStateService.generateSimon();
  }

}
