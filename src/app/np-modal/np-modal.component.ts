import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { NpModalOptions } from 'app/shared/np-modal-options';

@Component({
  selector: 'np-modal',
  templateUrl: './np-modal.component.html',
  styleUrls: ['./np-modal.component.css'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'translateY(-50%)' }),
        animate(300, keyframes([
          style({ opacity: 0, transform: 'translateY(-50%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(15px)', offset: 0.3 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 })
        ]))
      ]),
      transition('* => void', [
        animate(300, keyframes([
          style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(-15px)', offset: 0.7 }),
          style({ opacity: 0, transform: 'translateY(-50%)', offset: 1.0 })
        ]))
      ])
    ])
  ]
})
export class NpModalComponent implements OnInit {
  @Input() closable = true;
  @Input() visible: boolean;
  @Input() options: NpModalOptions;
  @Output() confirmed: EventEmitter<boolean> = new EventEmitter<boolean>();
  isAffirmed;

  constructor() { }

  ngOnInit() { }

  close() {
    this.visible = false;
    this.confirmed.emit(this.isAffirmed);
  }

  confirmee(yes) {
    this.isAffirmed = yes;
  }
}
