import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutForWaterComponent } from './about-for-water.component';

describe('AboutForWaterComponent', () => {
  let component: AboutForWaterComponent;
  let fixture: ComponentFixture<AboutForWaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutForWaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutForWaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
