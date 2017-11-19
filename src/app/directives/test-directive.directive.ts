import { Directive, EventEmitter } from '@angular/core';

@Directive({
  selector: 'interval-dir',
  outputs: ['everySecond', 'five5Secs: everyFiveSeconds']
})
export class TestDirectiveDirective {
  eric = ['erics', 'ericsaiya'];
  everySecond = new EventEmitter();
  five5Secs = new EventEmitter();
 
  constructor() {
    setInterval(() => this.everySecond.emit(this.eric), 1000);
  }
}
