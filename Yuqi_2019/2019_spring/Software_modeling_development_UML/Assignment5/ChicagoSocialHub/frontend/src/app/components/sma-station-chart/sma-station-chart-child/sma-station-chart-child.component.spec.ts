import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmaStationChartChildComponent } from './sma-station-chart-child.component';

describe('SmaStationChartChildComponent', () => {
  let component: SmaStationChartChildComponent;
  let fixture: ComponentFixture<SmaStationChartChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmaStationChartChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmaStationChartChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
