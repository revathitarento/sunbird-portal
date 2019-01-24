import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgRegisteredComponent } from './org-registered.component';

describe('OrgRegisteredComponent', () => {
  let component: OrgRegisteredComponent;
  let fixture: ComponentFixture<OrgRegisteredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgRegisteredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgRegisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
