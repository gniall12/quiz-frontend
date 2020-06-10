import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectPComponent } from './correct-p.component';

describe('CorrectPComponent', () => {
  let component: CorrectPComponent;
  let fixture: ComponentFixture<CorrectPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrectPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
