import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app',
  templateUrl: './test-component.component.html'
})
export class TestComponentComponent {
  everySecond(summat) { console.log(summat); }
}
