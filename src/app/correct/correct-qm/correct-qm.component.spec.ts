import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectQmComponent } from './correct-qm.component';

describe('CorrectQmComponent', () => {
  let component: CorrectQmComponent;
  let fixture: ComponentFixture<CorrectQmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrectQmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectQmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
