import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainenceErrorComponent } from './maintainence-error.component';

describe('MaintainenceErrorComponent', () => {
  let component: MaintainenceErrorComponent;
  let fixture: ComponentFixture<MaintainenceErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainenceErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainenceErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
