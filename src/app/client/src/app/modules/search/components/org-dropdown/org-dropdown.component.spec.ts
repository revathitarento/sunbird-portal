import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgDropdownComponent } from './org-dropdown.component';

describe('OrgDropdownComponent', () => {
  let component: OrgDropdownComponent;
  let fixture: ComponentFixture<OrgDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
