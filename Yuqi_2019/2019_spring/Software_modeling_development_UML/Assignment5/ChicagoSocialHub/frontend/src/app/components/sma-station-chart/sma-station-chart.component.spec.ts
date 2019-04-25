import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmaStationChartComponent } from './sma-station-chart.component';

describe('SmaStationChartComponent', () => {
  let component: SmaStationChartComponent;
  let fixture: ComponentFixture<SmaStationChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmaStationChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmaStationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
