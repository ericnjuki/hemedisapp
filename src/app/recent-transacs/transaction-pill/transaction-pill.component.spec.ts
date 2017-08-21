import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionPillComponent } from './transaction-pill.component';

describe('TransactionPillComponent', () => {
  let component: TransactionPillComponent;
  let fixture: ComponentFixture<TransactionPillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionPillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionPillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
