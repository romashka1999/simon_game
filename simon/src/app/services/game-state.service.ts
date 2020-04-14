import { Injectable } from '@angular/core';

import { START_COUNT, COLORS } from '../models/constants';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  simon: string[] = [];
  player: string[] = [];

  state = new Subject<any>();

  count: number;

  constructor() {
    this.count = START_COUNT;
  }

  private get randomColor(): string {
    const randomIndex = Math.floor(Math.random() * 4);
    return COLORS[randomIndex];
  }

  appendSimon(incerement: boolean = false): void {
    if(incerement) {
      this.count++;
    }
    this.simon.push(this.randomColor);
  }

  generateSimon(): string[] {
    this.simon = [];
    for(let i=0; i<this.count; i++) {
      this.appendSimon();
    }
    this.setState();
    return this.simon;
  }

  restartSimon(): string[] {
    this.count = START_COUNT;
    return this.generateSimon();
  }

  playerGuess(color: string) {
    this.player.push(color);
    if(!this.compareSimon()) {
      this.player = [];
      this.simon = [];
      this.count = START_COUNT;
      this.setState('defeated');
    } else {
      this.setState();
    }
  }

  compareSimon(): boolean {
    for(let i=0; i<this.player.length; i++) {
      if(this.player[i] !== this.simon[i]) {
        return false;
      }
    }

    if(this.player.length === this.simon.length) {
      this.updateGame();
    }
    return true;
  }

  updateGame() {
    this.appendSimon(true);
    this.player = [];
  }

  setState(gameStatus: string = 'running') {
    this.state.next({
      player: this.player,
      simon: this.simon,
      count: this.count,
      defeated: gameStatus === 'running'? false: true
    });
  }

}
